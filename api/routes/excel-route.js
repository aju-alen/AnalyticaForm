import express from 'express';
const router = express.Router();
import { apiCallLimiter } from '../middleware/rateLimiter.js'
import { verifyJwt } from '../middleware/verifyJwt.js';
import { performanceMonitor } from '../middleware/performanceMonitor.js';
import { exportToExcel,exportToExcelIndex } from '../controllers/excel-controller.js';



router.post('/export-to-excel',apiCallLimiter,verifyJwt, performanceMonitor({ logLevel: 'detailed' }), exportToExcel); // submit survey data of a particular survey for customers who are filling the survey
router.post('/export-to-excel-index',apiCallLimiter,verifyJwt, performanceMonitor({ logLevel: 'detailed' }), exportToExcelIndex); // submit survey data of a particular survey for customers who are filling the survey

export default router;