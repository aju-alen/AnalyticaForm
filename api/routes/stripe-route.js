import express from 'express';
const router = express.Router();
import {createCheckoutSessionForSubscription,stripeWebhook,createCheckoutSessionForMarketUser} from '../controllers/stripe-controller.js'


router.post('/create-checkout-session',createCheckoutSessionForSubscription)
router.post('/market/create-checkout-session',createCheckoutSessionForMarketUser)
router.post('/webhook',express.raw({type: 'application/json'}),stripeWebhook)
// router.post('/', express.raw({type: 'application/json'}),stripeWebhook)

export default router;