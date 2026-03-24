import express from 'express';
const router = express.Router();
import {
  createCheckoutSessionForSubscription,
  createCheckoutSessionForMarketUser,
  createCheckoutSessionForDriInterimUnlock,
  createCheckoutSessionForDriFullUnlock,
  getDriInterimPaymentStatus,
  getDriFullPaymentStatus,
  requestSubscriptionRefund,
} from '../controllers/stripe-controller.js'
import { verifyJwt } from '../middleware/verifyJwt.js';


router.post('/create-checkout-session',createCheckoutSessionForSubscription)
router.post('/market/create-checkout-session',createCheckoutSessionForMarketUser)
router.post('/dri/create-checkout-session', createCheckoutSessionForDriInterimUnlock)
router.post('/dri/full/create-checkout-session', createCheckoutSessionForDriFullUnlock)
router.get('/dri/interim/status/:responseId', getDriInterimPaymentStatus)
router.get('/dri/full/status/:responseId', getDriFullPaymentStatus)
router.post('/request-subscription-refund', verifyJwt, requestSubscriptionRefund)
// Webhook route is registered directly in index.js before body parsers to preserve raw body

export default router;