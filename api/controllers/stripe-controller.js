import stripe from 'stripe';
import {  stripeFrontendURL } from '../utils/corsFe.js';
const Stripe = stripe(process.env.STRIPE_SECRET_KEY);
console.log(process.env.STRIPE_SECRET_KEY,'env key');
const YOUR_DOMAIN = stripeFrontendURL;
console.log(YOUR_DOMAIN,'YOUR_DOMAIN')

export const createCheckoutSessionForSubscription = async (req, res) => {
    try {
        const prices = await Stripe.prices.list({
            lookup_keys: [req.body.lookup_key],
            expand: ['data.product'],
          });
          console.log(prices);
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
          console.log(session,'session');
        
          res.redirect(303, session.url);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message })
    }
}

const endpointSecret = "whsec_WwO4P8KQsXS1gzpfzMD8DKJUWxmder4H";

export const stripeWebhook = async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;
  console.log(endpointSecret,'endpointSecret');
  console.log(sig,'sig');
  console.log(request.body,'sig');
  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    console.log(event,'event');
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.async_payment_failed':
      const checkoutSessionAsyncPaymentFailed = event.data.object;
      console.log(checkoutSessionAsyncPaymentFailed,'checkoutSessionAsyncPaymentFailed');
      // Then define and call a function to handle the event checkout.session.async_payment_failed
      break;
    case 'checkout.session.async_payment_succeeded':
      const checkoutSessionAsyncPaymentSucceeded = event.data.object;
      console.log(checkoutSessionAsyncPaymentSucceeded,'checkoutSessionAsyncPaymentSucceeded');
      // Then define and call a function to handle the event checkout.session.async_payment_succeeded
      break;
    case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;
      console.log(checkoutSessionCompleted,'checkoutSessionCompleted');
      // Then define and call a function to handle the event checkout.session.completed
      break;
    case 'invoice.created':
      const invoiceCreated = event.data.object;
      console.log(invoiceCreated,'invoiceCreated');
      // Then define and call a function to handle the event invoice.created
      break;
    case 'invoice.payment_succeeded':
      const invoicePaymentSucceeded = event.data.object;
      console.log(invoicePaymentSucceeded,'invoicePaymentSucceeded');
      // Then define and call a function to handle the event invoice.payment_succeeded
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
  
};
