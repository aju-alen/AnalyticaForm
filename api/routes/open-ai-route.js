import express from 'express';
const router = express.Router();
import { vertexChat } from '../controllers/open-ai-controller.js';
import { verifyJwt } from '../middleware/verifyJwt.js';
import { apiCallLimiter } from '../middleware/rateLimiter.js';

router.post('/chat', apiCallLimiter, verifyJwt, vertexChat);

export default router;