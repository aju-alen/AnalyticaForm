import express from 'express';
import { apiCallLimiter } from '../middleware/rateLimiter.js';
import { downloadDriInterimPdf, downloadDriFullPdf,postPhdSuccessConsultationFormPdf } from '../controllers/dri-pdf-controller.js';

const router = express.Router();


router.post('/phd-success-consultation-form', apiCallLimiter, postPhdSuccessConsultationFormPdf);
router.get('/interim/pdf/:responseId', apiCallLimiter, downloadDriInterimPdf);
router.get('/full/pdf/:responseId', apiCallLimiter, downloadDriFullPdf);


export default router;
