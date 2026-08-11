import express from 'express';
import { apiCallLimiter } from '../middleware/rateLimiter.js';
import { verifyJwt } from '../middleware/verifyJwt.js';
import {
  getZoomStatus,
  getZoomAuthUrl,
  zoomOAuthCallback,
  disconnectZoom,
} from '../controllers/zoom-controller.js';

const router = express.Router();

router.get('/status', apiCallLimiter, verifyJwt, getZoomStatus);
router.get('/connect', apiCallLimiter, verifyJwt, getZoomAuthUrl);
router.get('/callback', zoomOAuthCallback);
router.delete('/disconnect', apiCallLimiter, verifyJwt, disconnectZoom);

export default router;
