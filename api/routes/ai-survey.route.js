import express from 'express';
import { verifyJwt } from '../middleware/verifyJwt.js';
import { apiCallLimiter } from '../middleware/rateLimiter.js';
import { getAiSurveyUsageForUser, generateAiSurvey } from '../controllers/ai-survey-controller.js';

const router = express.Router();

router.get('/usage', apiCallLimiter, verifyJwt, getAiSurveyUsageForUser);
router.post('/generate/:surveyId', apiCallLimiter, verifyJwt, generateAiSurvey);

export default router;
