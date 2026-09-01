import express from 'express';
const router = express.Router();
import { apiCallLimiter } from '../middleware/rateLimiter.js'
import { verifyJwt } from '../middleware/verifyJwt.js';
import { uploadToAWSImage, fetchImageDetails, uploadToAWSPdf, fetchPdfDetails } from '../controllers/awsS3-controller.js';

router.post('/upload-image/:awsId',uploadToAWSImage);
//user registration
router.get('/get-image/:awsId',fetchImageDetails)
router.post('/upload-pdf/:awsId', uploadToAWSPdf);
router.get('/get-pdf/:awsId', fetchPdfDetails);

export default router;