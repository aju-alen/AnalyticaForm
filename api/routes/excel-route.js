import express from 'express';
const router = express.Router();
import { apiCallLimiter } from '../middleware/rateLimiter.js'
import { verifyJwt } from '../middleware/verifyJwt.js';
import { exportToExcel,exportToExcelIndex } from '../controllers/excel-controller.js';



router.post('/export-to-excel',apiCallLimiter,verifyJwt, exportToExcel); // submit survey data of a particular survey for customers who are filling the survey
router.post('/export-to-excel-index',apiCallLimiter,verifyJwt, exportToExcelIndex); // submit survey data of a particular survey for customers who are filling the survey

export default router;