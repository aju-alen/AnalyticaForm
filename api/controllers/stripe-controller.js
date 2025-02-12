import stripe from 'stripe';
import {  stripeFrontendURL } from '../utils/corsFe.js';
import dotenv from 'dotenv';
dotenv.config();
const Stripe = stripe(process.env.STRIPE_SECRET_KEY);
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
            metadata:{
              userId:req.body.userId,
              emailId:req.body.emailId
            },
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
            cancel_url: `${YOUR_DOMAIN}/pricing`,
          });
        
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

const calculatePrice = (users) => {
  let totalPrice = 0;
  if (users <= 500) {
    totalPrice = users * 30;
  } else if (users <= 1000) {
    totalPrice = (500 * 30) + ((users - 500) * 20);
  } else {
    totalPrice = (500 * 30) + (500 * 20) + ((users - 1000) * 10);
  }
  return totalPrice;
};

export const createCheckoutSessionForMarketUser = async (req, res) => {
  try {
    const { amount, currency, unit, userId, emailId, name, selectedRegions, selectedIndustries, selectedEducationLevels, selectedPositions, selectedExperience } = req.body;
    const backendAmount = calculatePrice(unit);
    console.log(req.body,'bodyyyyyyyyy in');
    
    // Ensure the backend amount matches the provided amount
    if (backendAmount !== Number(amount)) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    // Create a generic product if it doesn't already exist
    const product = await Stripe.products.create({
      name: "User Responses", // Generic name
      description: "Pay for user responses"
    });

    // Dynamically create a price object in Stripe based on calculated amount
    const price = await Stripe.prices.create({
      unit_amount: backendAmount * 100, // Amount in cents
      currency: currency || "aed", // Use the provided currency or default to AED
      product: product.id, // Use the created product ID
      tax_behavior: "exclusive",
    });

    // Create the checkout session
    const customer = await Stripe.customers.create({
      email: emailId,
      name: name,
      address: {
        line1: "123 Main Street",
        city: "Dubai",
        country: "AE", // Use a valid 2-letter country code
        postal_code: "00000",
      },
    });

    const session = await Stripe.checkout.sessions.create({
      customer: customer.id,
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${YOUR_DOMAIN}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}?canceled=true`,
      automatic_tax: { enabled: true },
      metadata: {
        userId: userId,
        emailId: emailId,
      },
      payment_intent_data: {
        metadata: {
          userId: userId,
          emailId: emailId,
          selectedRegions, 
          selectedIndustries,
          selectedEducationLevels,
          selectedPositions,
          selectedExperience,
          unit,
        },
      },
      customer_update: {
        address: "auto",
      },
    });
    
    res.redirect(303, session.url);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
