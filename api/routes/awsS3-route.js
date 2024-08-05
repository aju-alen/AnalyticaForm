import express from 'express';
const router = express.Router();
import { apiCallLimiter } from '../middleware/rateLimiter.js'
import { verifyJwt } from '../middleware/verifyJwt.js';
import { uploadToAWSImage,fetchImageDetails } from '../controllers/awsS3-controller.js';

router.post('/upload-image/:awsId',uploadToAWSImage);
//user registration
router.get('/get-image/:awsId',fetchImageDetails)

export default router;