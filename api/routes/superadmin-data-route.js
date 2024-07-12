import express from 'express';
const router = express.Router();
import { apiCallLimiter } from '../middleware/rateLimiter.js'
import { verifyJwt } from '../middleware/verifyJwt.js';
import { getSingleSurveyDataForUser } from '../controllers/superadmin-data-controller.js';


router.get('/get-user-data',apiCallLimiter,verifyJwt, getSingleSurveyDataForUser); 
export default router;