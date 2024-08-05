import express from 'express';
const router = express.Router();
import { apiCallLimiter } from '../middleware/rateLimiter.js'
import { verifyJwt } from '../middleware/verifyJwt.js';
import { contactUs } from '../controllers/sendEmail-controller.js';

router.post('/contact-us',apiCallLimiter,verifyJwt, contactUs); 
export default router;