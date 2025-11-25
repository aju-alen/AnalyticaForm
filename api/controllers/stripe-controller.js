import {  stripeFrontendURL } from '../utils/corsFe.js';
import { marketSuccessPaymentEmail, subscriptionPaymentSuccessfulEmailTemplate, marketPurchaseAdminNotificationEmail } from '../utils/static/static-data.js';
import { resendEmailBoiler } from '../utils/resendEmailTemplate.js';

import dotenv from 'dotenv';
dotenv.config();

import stripe from 'stripe';
const Stripe = stripe(process.env.STRIPE_SECRET_KEY);

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();


const YOUR_DOMAIN = stripeFrontendURL;


export const createCheckoutSessionForSubscription = async (req, res) => {
  console.log(req.body, 'req.body');
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
  const endpointSecret = process.env.STRIPE_WEBHOOK_SIGNING_SECRET;
  const sig = request.headers['stripe-signature'];

  // Verify signature header exists
  if (!sig) {
    console.error('Webhook Error: Missing stripe-signature header');
    return response.status(400).send('Missing stripe-signature header');
  }

  // Verify endpoint secret is configured
  if (!endpointSecret) {
    console.error('Webhook Error: Webhook signing secret is not configured');
    return response.status(500).send('Webhook configuration error');
  }

  // Verify request body is a Buffer (required for signature verification)
  if (!request.body || !Buffer.isBuffer(request.body)) {
    console.error('Webhook Error: Request body is not a Buffer. Body type:', typeof request.body);
    console.error('Body is parsed:', typeof request.body === 'object' && !Buffer.isBuffer(request.body));
    return response.status(400).send('Invalid request body format - body must be raw Buffer');
  }

  // Debug logging (first 10 chars of secret to verify it's loaded, without exposing full secret)
  console.log('Webhook Debug Info:');
  let event;
  try {
    // request.body must be a Buffer for signature verification
    event = Stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    console.log('Webhook signature verified successfully. Event type:', event.type);
  } catch (err) {
    console.error('Webhook Error:', err.message);
    
    // Additional check: Try to parse signature to see if it's valid format
    if (sig) {
      const sigParts = sig.split(',');
      console.error('- Signature parts count:', sigParts.length);
      sigParts.forEach((part, idx) => {
        const [key, value] = part.split('=');
        console.error(`  Part ${idx}: ${key} = ${value ? value.substring(0, 20) + '...' : 'empty'}`);
      });
    }
    
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    
    case 'checkout.session.completed':
      const checkoutSession = event.data.object;
      try {
        const { userId, articleId } = checkoutSession.metadata;
        if (checkoutSession.status === 'complete') {
          // const invoice = await Stripe.invoices.retrieve(checkoutSession.invoice);
         
        } else {
          console.log('checkout session is not complete');
        }
      } catch (err) {
        console.log(err, 'error in webhook checkout.session.completed');
      }
      break;

    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      const externalInvoiceData = invoice.lines.data[0];
      
      if (externalInvoiceData.type === 'subscription') {
        console.log(externalInvoiceData, 'insiddededeed');
        try {
          if (invoice.status === 'paid') {
            try {
              await prisma.$transaction(async (tx) => {
                const checkUserExist = await tx.proMember.findUnique({
                  where: {
                    subscriptionEmail: invoice.customer_email
                  }
                });

                if (checkUserExist) {
                  await tx.proMember.update({
                    where: {
                      subscriptionEmail: invoice.customer_email
                    },
                    data: {
                      isSubscribed: true,
                      subscriptionPeriodStart: externalInvoiceData.period.start,
                      subscriptionPeriodEnd: externalInvoiceData.period.end,
                      invoiceId: invoice.id,
                      customerId: invoice.customer,
                      hosted_invoice_url: invoice.hosted_invoice_url,
                      subscriptionAmmount: externalInvoiceData.amount,
                      hosted_invoice_pdf: invoice.invoice_pdf,
                    }
                  });
                } else {
                  const user = await tx.user.findUnique({
                    where: {
                      email: invoice.customer_email
                    }
                  });

                  if (!user) {
                    throw new Error(`User not found with email: ${invoice.customer_email}`);
                  }

                  await tx.proMember.create({
                    data: {
                      isSubscribed: true,
                      subscriptionEmail: invoice.customer_email,
                      subscriptionPeriodStart: externalInvoiceData.period.start,
                      subscriptionPeriodEnd: externalInvoiceData.period.end,
                      invoiceId: invoice.id,
                      customerId: invoice.customer,
                      hosted_invoice_url: invoice.hosted_invoice_url,
                      subscriptionAmmount: externalInvoiceData.amount,
                      hosted_invoice_pdf: invoice.invoice_pdf,
                      userId: user.id
                    }
                  });

                  await tx.user.update({
                    where: { email: invoice.customer_email },
                    data: {
                      isAProMember: true
                    }
                  });
                }
              });

              // Send email to user
              const user = await prisma.user.findUnique({
                where: {
                  email: invoice.customer_email
                }
              });

              if (user) {
                // Format dates from Unix timestamps to readable format
                const formatDate = (timestamp) => {
                  const date = new Date(timestamp * 1000);
                  return date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  });
                };

                // Format amount from cents to currency
                const formatAmount = (amount, currency = 'aed') => {
                  const amountInDollars = (amount / 100).toFixed(2);
                  const currencySymbol = currency.toUpperCase() === 'AED' ? 'AED' : currency.toUpperCase();
                  return `${currencySymbol}${amountInDollars}`;
                };

                const subscriptionPeriodStart = formatDate(externalInvoiceData.period.start);
                const subscriptionPeriodEnd = formatDate(externalInvoiceData.period.end);
                const subscriptionAmount = formatAmount(externalInvoiceData.amount, invoice.currency);
                const userName = user.lastName || user.firstName || 'Valued Customer';

                const emailHtml = subscriptionPaymentSuccessfulEmailTemplate(
                  userName,
                  subscriptionPeriodStart,
                  subscriptionPeriodEnd,
                  invoice.hosted_invoice_url,
                  invoice.invoice_pdf,
                  subscriptionAmount
                );

                await resendEmailBoiler(
                  process.env.GMAIL_AUTH_USER,
                  user.email,
                  'Subscription Payment Successful',
                  emailHtml
                );
              }

              console.log('Transaction completed successfully');
            } catch (error) {
              console.error('Transaction failed:', error);
              throw error; // Re-throw to handle it in the webhook handler
            }
          }
        } catch (err) {
          console.log(err, 'This is the error in invoice payment succeeded');
        }
      }
      // Handle successful payment
      break;

    case 'charge.updated':
      const chargeUpdated = event.data.object;
      console.log(chargeUpdated, 'charge');
      if (chargeUpdated.paid) {

        // const paymentIntentId = chargeUpdated.payment_intent;

        try {
          // const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
          if(chargeUpdated.metadata.purchaseType === 'user-market'){
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
          const emailHtml = marketSuccessPaymentEmail(
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
          );

          // Send receipt email to customer
          const sendReceiptEmail = await resendEmailBoiler(
            process.env.GMAIL_AUTH_USER_SUPPORT,
            chargeUpdated.metadata.emailId,
            'Congratulations! Your payment has been successful',
            emailHtml
          );
          console.log(sendReceiptEmail, 'sendReceiptEmail');

          // Send admin notification email
          const purchaseDate = new Date(chargeUpdated.created * 1000).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            timeZoneName: 'short'
          });

          const adminEmailHtml = marketPurchaseAdminNotificationEmail(
            chargeUpdated.billing_details.name,
            chargeUpdated.billing_details.email || chargeUpdated.metadata.emailId,
            chargeUpdated.amount / 100,
            chargeUpdated.currency.toUpperCase(),
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
            chargeUpdated.receipt_url,
            chargeUpdated.payment_intent,
            purchaseDate
          );

          resendEmailBoiler(
            process.env.GMAIL_AUTH_USER_SUPPORT,
            'mickeygenerale@gmail.com',
            `New Market Purchase: ${chargeUpdated.billing_details.name} - ${chargeUpdated.currency.toUpperCase()} ${chargeUpdated.amount / 100}`,
            adminEmailHtml
          )
          
          }
        }
        catch (err) {
          console.log(err);
        }

      }
      // Then define and call a function to handle the event charge.updated
      break;

      case 'charge.refunded':
        const chargeRefunded = event.data.object;
        try {
        console.log(chargeRefunded, 'chargeRefunded object');

        const removePurchase = await prisma.proMember.updateMany({
          where: {
            customerId: chargeRefunded.customer
          },
          data: {
            isSubscribed: false,
            subscriptionPeriodEnd: 0,
            subscriptionPeriodStart: 0,
          }
        });
        } catch (err) {
          console.log(err);
        }
        break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();

};

const calculatePrice = (users) => {
  if (users <= 300) {
    return users * 30;
  } else if (users <= 600) {
    return users * 25;
  } else if (users <= 900) {
    return users * 20;
  } else {
    return users * 10;
  }
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
          purchaseType: 'user-market',
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
