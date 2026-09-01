import express from 'express';
const router = express.Router();
import { vertexChat, getAssistantChatUsage } from '../controllers/open-ai-controller.js';
import { verifyJwt } from '../middleware/verifyJwt.js';
import { apiCallLimiter } from '../middleware/rateLimiter.js';

router.post('/chat', apiCallLimiter, verifyJwt, vertexChat);
router.get('/chat-usage', apiCallLimiter, verifyJwt, getAssistantChatUsage);

export default router;