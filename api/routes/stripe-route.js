import express from 'express';
const router = express.Router();
import { apiCallLimiter } from '../middleware/rateLimiter.js'
import { verifyJwt } from '../middleware/verifyJwt.js';
import {createCheckoutSessionForSubscription} from '../controllers/stripe-controller.js'


router.post('/create-checkout-session',createCheckoutSessionForSubscription)

export default router;