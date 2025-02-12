import express from 'express';
const router = express.Router();
import { getPurchaseDetails } from '../controllers/survey-count-controller.js';


router.get('/get-purchase-details/:sessionId', getPurchaseDetails); 

export default router;