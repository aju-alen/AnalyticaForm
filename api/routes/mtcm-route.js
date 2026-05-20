import express from 'express';
const router = express.Router();
import { ContactUs } from '../controllers/resendEmailController.js';

router.post('/contact-us', ContactUs);

export default router;