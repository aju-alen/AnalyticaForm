import express from 'express';
const router = express.Router();
import { ContactUs, MembershipEnquiry } from '../controllers/resendEmailController.js';

router.post('/contact-us', ContactUs);
router.post('/membership-enquiry', MembershipEnquiry);
router.post('/resources', ResourcesRequest);

export default router;