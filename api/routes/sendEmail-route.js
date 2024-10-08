import express from 'express';
const router = express.Router();
import { apiCallLimiter } from '../middleware/rateLimiter.js'
import { verifyJwt } from '../middleware/verifyJwt.js';
import { contactUs,reportAbuse,reportNfswImage } from '../controllers/sendEmail-controller.js';

router.post('/contact-us',apiCallLimiter,verifyJwt, contactUs); 
router.post('/report-abuse/:surveyId',apiCallLimiter,verifyJwt, reportAbuse); 
router.post('/report-nsfw',apiCallLimiter,verifyJwt, reportNfswImage); 
export default router;