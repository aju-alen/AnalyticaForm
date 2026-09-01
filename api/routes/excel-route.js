import express from 'express';
const router = express.Router();
import { apiCallLimiter } from '../middleware/rateLimiter.js'
import { verifyJwt } from '../middleware/verifyJwt.js';
import { performanceMonitor } from '../middleware/performanceMonitor.js';
import { exportToExcel, exportToExcelIndex, exportSurveyToExcel, exportSurveyToExcelIndex, exportQuestionSummary } from '../controllers/excel-controller.js';



router.post('/export-to-excel',apiCallLimiter,verifyJwt, performanceMonitor({ logLevel: 'detailed' }), exportToExcel);
router.post('/export-to-excel-index',apiCallLimiter,verifyJwt, performanceMonitor({ logLevel: 'detailed' }), exportToExcelIndex);
router.post('/export-to-excel/:surveyId',apiCallLimiter,verifyJwt, performanceMonitor({ logLevel: 'detailed' }), exportSurveyToExcel);
router.post('/export-to-excel-index/:surveyId',apiCallLimiter,verifyJwt, performanceMonitor({ logLevel: 'detailed' }), exportSurveyToExcelIndex);
router.post('/export-question-summary/:surveyId',apiCallLimiter,verifyJwt, performanceMonitor({ logLevel: 'detailed' }), exportQuestionSummary);

export default router;