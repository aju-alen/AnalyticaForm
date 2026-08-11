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

export const zoomOAuthCallback = async (req, res) => {
  const frontend =
    process.env.STRIPE_FRONTEND_URL ||
    process.env.FRONTEND_URL?.replace(/[\[\]`"']/g, '').split(',')[0] ||
    'http://localhost:5173';
  const redirectBase = String(frontend).includes('http')
    ? String(frontend).replace(/\/$/, '')
    : 'http://localhost:5173';

  try {
    const { code, state } = req.query;
    if (!code || !state) {
      return res.redirect(`${redirectBase}/dashboard?zoom=error`);
    }
    const parsed = JSON.parse(Buffer.from(String(state), 'base64url').toString('utf8'));
    const userId = parsed?.userId;
    if (!userId) {
      return res.redirect(`${redirectBase}/dashboard?zoom=error`);
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
    return res.redirect(`${redirectBase}/dashboard?zoom=error`);
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
