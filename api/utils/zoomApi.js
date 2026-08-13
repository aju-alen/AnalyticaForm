import { prisma } from './prisma.js';

function getZoomConfig() {
  const clientId = process.env.ZOOM_CLIENT_ID;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;
  const redirectUri = process.env.ZOOM_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Zoom OAuth is not configured (ZOOM_CLIENT_ID / ZOOM_CLIENT_SECRET / ZOOM_REDIRECT_URI).');
  }
  return { clientId, clientSecret, redirectUri };
}

export function getZoomAuthorizeUrl(state) {
  const { clientId, redirectUri } = getZoomConfig();
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: redirectUri,
    state,
  });
  return `https://zoom.us/oauth/authorize?${params.toString()}`;
}

async function exchangeToken(body) {
  const { clientId, clientSecret } = getZoomConfig();
  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const res = await fetch('https://zoom.us/oauth/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(body).toString(),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.reason || data?.error || 'Zoom token exchange failed');
  }
  return data;
}

export async function exchangeZoomCodeForTokens(code) {
  const { redirectUri } = getZoomConfig();
  return exchangeToken({
    grant_type: 'authorization_code',
    code,
    redirect_uri: redirectUri,
  });
}

export async function refreshZoomAccessToken(refreshToken) {
  return exchangeToken({
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });
}

export async function fetchZoomUser(accessToken) {
  const res = await fetch('https://api.zoom.us/v2/users/me', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || 'Failed to fetch Zoom user');
  }
  return data;
}

export async function getValidZoomAccessToken(userId) {
  const connection = await prisma.userZoomConnection.findUnique({ where: { userId } });
  if (!connection) return null;

  const expiresSoon = connection.tokenExpiresAt.getTime() <= Date.now() + 60_000;
  if (!expiresSoon) {
    return { accessToken: connection.accessToken, connection };
  }

  const refreshed = await refreshZoomAccessToken(connection.refreshToken);
  const updated = await prisma.userZoomConnection.update({
    where: { userId },
    data: {
      accessToken: refreshed.access_token,
      refreshToken: refreshed.refresh_token || connection.refreshToken,
      tokenExpiresAt: new Date(Date.now() + (refreshed.expires_in || 3600) * 1000),
    },
  });
  return { accessToken: updated.accessToken, connection: updated };
}

export async function createZoomMeetingForHost(accessToken, { topic, durationMinutes = 120 }) {
  const start = new Date();
  const res = await fetch('https://api.zoom.us/v2/users/me/meetings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      topic: topic || 'Survey interview',
      type: 2,
      start_time: start.toISOString(),
      duration: durationMinutes,
      timezone: 'UTC',
      settings: {
        join_before_host: true,
        waiting_room: false,
        meeting_authentication: false,
      },
    }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || 'Failed to create Zoom meeting');
  }
  const expiresAt = new Date(start.getTime() + durationMinutes * 60 * 1000);
  return {
    meetingId: String(data.id),
    joinUrl: data.join_url,
    startUrl: data.start_url,
    createdAt: start.toISOString(),
    expiresAt: expiresAt.toISOString(),
    status: 'active',
  };
}

export async function deleteZoomMeeting(accessToken, meetingId) {
  const res = await fetch(`https://api.zoom.us/v2/meetings/${meetingId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok && res.status !== 404) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || `Failed to delete Zoom meeting ${meetingId}`);
  }
}
