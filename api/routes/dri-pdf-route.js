import express from 'express';
import { apiCallLimiter } from '../middleware/rateLimiter.js';
import { downloadDriInterimPdf, downloadDriFullPdf } from '../controllers/dri-pdf-controller.js';

const router = express.Router();

router.get('/interim/pdf/:responseId', apiCallLimiter, downloadDriInterimPdf);
router.get('/full/pdf/:responseId', apiCallLimiter, downloadDriFullPdf);

export default router;
