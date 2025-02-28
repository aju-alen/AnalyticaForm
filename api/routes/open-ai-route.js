import express from 'express';
const router = express.Router();
import { vertexChat } from '../controllers/open-ai-controller.js';
import { verifyJwt } from '../middleware/verifyJwt.js';

router.post('/chat',verifyJwt,vertexChat);

export default router;