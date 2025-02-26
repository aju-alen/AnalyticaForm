import express from 'express';
const router = express.Router();
import { vertexChat } from '../controllers/open-ai-controller.js';

router.post('/chat',vertexChat);

export default router;