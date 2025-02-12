import express from 'express';
const router = express.Router();
import { apiCallLimiter } from '../middleware/rateLimiter.js'
import { verifyJwt } from '../middleware/verifyJwt.js';
import {createCheckoutSessionForSubscription,stripeWebhook,createCheckoutSessionForMarketUser} from '../controllers/stripe-controller.js'


router.post('/create-checkout-session',createCheckoutSessionForSubscription)
router.post('/market/create-checkout-session',createCheckoutSessionForMarketUser)
// router.post('/', express.raw({type: 'application/json'}),stripeWebhook)

export default router;