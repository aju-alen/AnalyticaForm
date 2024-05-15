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

const endpointSecret = "whsec_85cb6e9c519f49df3be95a4f7f6ffa0558352b0e63e25b1da45b1535691f0947";

export const stripeWebhook = async (req, res) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.async_payment_failed':
      const checkoutSessionAsyncPaymentFailed = event.data.object;
      // Then define and call a function to handle the event checkout.session.async_payment_failed
      break;
    case 'checkout.session.async_payment_succeeded':
      const checkoutSessionAsyncPaymentSucceeded = event.data.object;
      // Then define and call a function to handle the event checkout.session.async_payment_succeeded
      break;
    case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;
      // Then define and call a function to handle the event checkout.session.completed
      break;
    case 'invoice.created':
      const invoiceCreated = event.data.object;
      // Then define and call a function to handle the event invoice.created
      break;
    case 'invoice.payment_succeeded':
      const invoicePaymentSucceeded = event.data.object;
      // Then define and call a function to handle the event invoice.payment_succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
  
};
