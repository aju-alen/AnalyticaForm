import { PrismaClient } from '@prisma/client';
import {
  getZoomAuthorizeUrl,
  exchangeZoomCodeForTokens,
  fetchZoomUser,
} from '../utils/zoomApi.js';

const prisma = new PrismaClient();

export const getZoomStatus = async (req, res) => {
  try {
    const connection = await prisma.userZoomConnection.findUnique({
      where: { userId: req.tokenId },
      select: { zoomEmail: true, zoomUserId: true, updatedAt: true },
    });
    res.status(200).json({
      connected: Boolean(connection),
      zoomEmail: connection?.zoomEmail || null,
      zoomUserId: connection?.zoomUserId || null,
    });
  } catch (err) {
    console.error('[zoom status]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getZoomAuthUrl = async (req, res) => {
  try {
    const state = Buffer.from(JSON.stringify({ userId: req.tokenId })).toString('base64url');
    const url = getZoomAuthorizeUrl(state);
    res.status(200).json({ url });
  } catch (err) {
    console.error('[zoom auth-url]', err);
    res.status(500).json({ message: err.message || 'Zoom is not configured' });
  }
};

function zoomFrontendBase() {
  const frontend =
    process.env.STRIPE_FRONTEND_URL ||
    process.env.FRONTEND_URL?.replace(/[\[\]`"']/g, '').split(',')[0] ||
    'http://localhost:5173';
  return String(frontend).includes('http')
    ? String(frontend).replace(/\/$/, '')
    : 'http://localhost:5173';
}

function zoomErrorRedirect(redirectBase, reason) {
  const params = new URLSearchParams({
    zoom: 'error',
    reason: String(reason || 'unknown').slice(0, 180),
  });
  return `${redirectBase}/dashboard?${params.toString()}`;
}

export const zoomOAuthCallback = async (req, res) => {
  const redirectBase = zoomFrontendBase();

  try {
    const { code, state } = req.query;
    if (!code || !state) {
      return res.redirect(zoomErrorRedirect(redirectBase, 'missing_code_or_state'));
    }
    let userId;
    try {
      const parsed = JSON.parse(Buffer.from(String(state), 'base64url').toString('utf8'));
      userId = parsed?.userId;
    } catch {
      return res.redirect(zoomErrorRedirect(redirectBase, 'invalid_state'));
    }
    if (!userId) {
      return res.redirect(zoomErrorRedirect(redirectBase, 'missing_user_id'));
    }

    const tokens = await exchangeZoomCodeForTokens(String(code));
    const zoomUser = await fetchZoomUser(tokens.access_token);

    await prisma.userZoomConnection.upsert({
      where: { userId },
      create: {
        userId,
        zoomUserId: String(zoomUser.id),
        zoomEmail: zoomUser.email || null,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiresAt: new Date(Date.now() + (tokens.expires_in || 3600) * 1000),
      },
      update: {
        zoomUserId: String(zoomUser.id),
        zoomEmail: zoomUser.email || null,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiresAt: new Date(Date.now() + (tokens.expires_in || 3600) * 1000),
      },
    });

    return res.redirect(`${redirectBase}/dashboard?zoom=connected`);
  } catch (err) {
    console.error('[zoom callback]', err);
    return res.redirect(zoomErrorRedirect(redirectBase, err?.message || 'callback_failed'));
  }
};

export const disconnectZoom = async (req, res) => {
  try {
    await prisma.userZoomConnection.deleteMany({ where: { userId: req.tokenId } });
    res.status(200).json({ message: 'Zoom disconnected' });
  } catch (err) {
    console.error('[zoom disconnect]', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
