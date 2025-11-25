import express from 'express';
const router = express.Router();
import { apiCallLimiter } from '../middleware/rateLimiter.js'
import { verifyJwt } from '../middleware/verifyJwt.js';
import { contactUs,reportAbuse,reportNfswImage,sendSurveyExcelViaEmail } from '../controllers/sendEmail-controller.js';

router.post('/contact-us',apiCallLimiter, contactUs); 
router.post('/report-abuse/:surveyId',apiCallLimiter,verifyJwt, reportAbuse); 
router.post('/report-nsfw',apiCallLimiter,verifyJwt, reportNfswImage); 
router.post('/send-survey-excel',apiCallLimiter,verifyJwt, sendSurveyExcelViaEmail);
export default router;