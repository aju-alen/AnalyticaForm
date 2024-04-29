import express from 'express';
const router = express.Router();
import { createNewSurvey,getUserSurvey } from '../controllers/survey-controller.js';
import { apiCallLimiter } from '../middleware/rateLimiter.js'
import { verifyJwt } from '../middleware/verifyJwt.js';

router.post('/create',apiCallLimiter,verifyJwt, createNewSurvey);
router.get('/get-all-survey',apiCallLimiter,verifyJwt, getUserSurvey);

export default router;