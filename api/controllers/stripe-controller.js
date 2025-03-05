import {  stripeFrontendURL } from '../utils/corsFe.js';
import sendEmail from '../utils/emailTemplateTransport.js';
import { marketSuccessPaymentEmail } from '../utils/static/static-data.js';

import dotenv from 'dotenv';
dotenv.config();

import stripe from 'stripe';
const Stripe = stripe(process.env.STRIPE_SECRET_KEY);

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();


const YOUR_DOMAIN = stripeFrontendURL;


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

export const stripeWebhook = async (request, response) => {
  // const endpointSecret = "whsec_WwO4P8KQsXS1gzpfzMD8DKJUWxmder4H";
  const endpointSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET;
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
      break;


    case 'checkout.session.async_payment_succeeded':
      const checkoutSessionAsyncPaymentSucceeded = event.data.object;
      break;


    case 'checkout.session.completed':
      const checkoutSessionCompleted = event.data.object;
      break;

    case 'customer.subscription.deleted':
      const customerSubscriptionDeleted = event.data.object;
      break;

    case 'customer.subscription.updated':
      const customerSubscriptionUpdated = event.data.object;
      break;

    case 'invoice.created':
      const invoiceCreated = event.data.object;
      break;


    case 'invoice.payment_succeeded': //--This is run when the payment is successful
      const invoicePaymentSucceeded = event.data.object;
      const findCustomer = await prisma.proMember.findUnique({
        where: { subscriptionEmail: invoicePaymentSucceeded.customer_email }
      });

      if (findCustomer) {

        const updateSubscription = await prisma.proMember.update({
          where: { subscriptionEmail: invoicePaymentSucceeded.customer_email },
          data: {
            isSubscribed: true,
            subscriptionAmmount: invoicePaymentSucceeded.amount_paid,
            subscriptionPeriodStart: invoicePaymentSucceeded.lines.data[0].period.start,
            subscriptionPeriodEnd: invoicePaymentSucceeded.lines.data[0].period.end,
            hosted_invoice_url: invoicePaymentSucceeded.hosted_invoice_url,
            hosted_invoice_pdf: invoicePaymentSucceeded.invoice_pdf,
            invoiceId: invoicePaymentSucceeded.id,
            customerId: invoicePaymentSucceeded.subscription
          }
        });
      }
      else {

        const findUserId = await prisma.user.findFirst({
          where: {
            email: invoicePaymentSucceeded.customer_email
          },
          select: {
            id: true,
          }
        });

        const subscription = await prisma.proMember.create({
          data: {
            isSubscribed: true,
            subscriptionAmmount: invoicePaymentSucceeded.amount_paid,
            subscriptionPeriodStart: invoicePaymentSucceeded.lines.data[0].period.start,
            subscriptionPeriodEnd: invoicePaymentSucceeded.lines.data[0].period.end,
            subscriptionEmail: invoicePaymentSucceeded.customer_email,
            hosted_invoice_url: invoicePaymentSucceeded.hosted_invoice_url,
            hosted_invoice_pdf: invoicePaymentSucceeded.invoice_pdf,
            invoiceId: invoicePaymentSucceeded.id,
            customerId: invoicePaymentSucceeded.subscription,
            userId: findUserId.id

          }
        });
        const updateUserData = await prisma.user.update({
          where: { email: invoicePaymentSucceeded.customer_email },
          data: {
            isAProMember: true
          }
        });
      }
      await prisma.$disconnect();
      break;

    case 'charge.updated':
      const chargeUpdated = event.data.object;
      console.log(chargeUpdated, 'charge');
      if (chargeUpdated.paid) {

        // const paymentIntentId = chargeUpdated.payment_intent;

        try {
          // const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
          const paymentIntent = await Stripe.paymentIntents.retrieve(chargeUpdated.payment_intent);

          // Get sessions associated with this payment intent
          const sessions = await Stripe.checkout.sessions.list({
            payment_intent: paymentIntent.id,
            limit: 1
          });

          const sessionId = sessions.data[0].id;

          const createPayment = await prisma.responsePurchase.create({
            data: {
              userEmail: chargeUpdated.billing_details.email,
              responseQuantity: Number(chargeUpdated.metadata.unit),
              amountPaid: chargeUpdated.amount,
              amountCurrency: chargeUpdated.currency,
              paidStatus: chargeUpdated.paid,
              stripePaymentIntentId: chargeUpdated.payment_intent,
              stripeRecieptUrl: chargeUpdated.receipt_url,
              selectedRegions: chargeUpdated.metadata.selectedRegions,
              selectedIndustries: chargeUpdated.metadata.selectedIndustries,
              selectedEducationLevels: chargeUpdated.metadata.selectedEducationLevels,
              selectedPositions: chargeUpdated.metadata.selectedPositions,
              selectedExperience: chargeUpdated.metadata.selectedExperience,
              sessionIdUrl: sessionId,
              stripeName: chargeUpdated.billing_details.name,
              stripeCountry: chargeUpdated.billing_details.address.country,
              stripeAddressLineOne: chargeUpdated.billing_details.address.line1,
              stripeAddressLineTwo: chargeUpdated.billing_details.address.line2,
              stripePostalCode: chargeUpdated.billing_details.address.postal_code,
              stripeState: chargeUpdated.billing_details.address.state,
              stripeCardBrand: chargeUpdated.payment_method_details.card.brand,
              stripeCardLastFourDigit: chargeUpdated.payment_method_details.card.last4,
              userId: chargeUpdated.metadata.userId,  
            }
          });
          const sendReceiptEmail = await sendEmail({
            senderEmailId: process.env.GMAIL_AUTH_USER_SUPPORT,
            receiverEmailId: chargeUpdated.metadata.emailId,
            subject: 'Congratulations! Your payment has been successful',
            htmlString: marketSuccessPaymentEmail(
              chargeUpdated.billing_details.name,
              chargeUpdated.amount / 100,
              chargeUpdated.currency.toUpperCase(),
              chargeUpdated.paid,
              chargeUpdated.payment_method_details.card.brand,
              chargeUpdated.payment_method_details.card.last4,
              chargeUpdated.billing_details.address.line1,
              chargeUpdated.billing_details.address.city,
              chargeUpdated.billing_details.address.state,
              chargeUpdated.billing_details.address.country,
              chargeUpdated.billing_details.address.postal_code,
              chargeUpdated.metadata.unit,
              chargeUpdated.metadata.selectedRegions,
              chargeUpdated.metadata.selectedIndustries,
              chargeUpdated.metadata.selectedEducationLevels,
              chargeUpdated.metadata.selectedPositions,
              chargeUpdated.metadata.selectedExperience,
              chargeUpdated.receipt_url
            )
          })
          console.log(sendReceiptEmail, 'sendReceiptEmail');
          
        }
        catch (err) {
          console.log(err);
        }

      }
      // Then define and call a function to handle the event charge.updated
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
