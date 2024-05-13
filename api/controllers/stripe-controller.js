import stripe from 'stripe';
import { frontendURL } from '../utils/corsFe.js';
const Stripe = stripe(process.env.STRIPE_SECRET_KEY);
const YOUR_DOMAIN = frontendURL;
export const createCheckoutSessionForSubscription = async (req, res) => {
    console.log(req.body,'req.body');
    console.log(req.body.emailId,'req.body');
    try {
        const prices = await Stripe.prices.list({
            lookup_keys: [req.body.lookup_key],
            expand: ['data.product'],
          });
          const session = await Stripe.checkout.sessions.create({
            billing_address_collection: 'auto',
            customer_email: req.body.emailId,
            line_items: [
              {
                price: prices.data[0].id,
                // For metered billing, do not pass quantity
                quantity: 1,
        
              },
            ],
            mode: 'subscription',
            success_url: `${YOUR_DOMAIN}/payment-success?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${YOUR_DOMAIN}?canceled=true`,
          });
        
          res.redirect(303, session.url);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message })
    }
}