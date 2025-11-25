import express from 'express';
const router = express.Router();
import {createCheckoutSessionForSubscription,createCheckoutSessionForMarketUser} from '../controllers/stripe-controller.js'


router.post('/create-checkout-session',createCheckoutSessionForSubscription)
router.post('/market/create-checkout-session',createCheckoutSessionForMarketUser)
// Webhook route is registered directly in index.js before body parsers to preserve raw body

export default router;