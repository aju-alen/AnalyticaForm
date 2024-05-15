import express from 'express';
const router = express.Router();
import { apiCallLimiter } from '../middleware/rateLimiter.js'
import { verifyJwt } from '../middleware/verifyJwt.js';
import {createCheckoutSessionForSubscription,stripeWebhook} from '../controllers/stripe-controller.js'


router.post('/create-checkout-session',createCheckoutSessionForSubscription)
router.post('/webhook', express.raw({type: 'application/json'}),stripeWebhook)

export default router;