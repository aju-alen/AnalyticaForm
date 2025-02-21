import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler.js';
import { corsOptions } from './utils/corsFe.js';
import authRoute from './routes/auth-route.js';
import surveyRoute from './routes/survey-route.js';
import userResponseSurveyRoute from './routes/user-response-survey.route.js';
import excelRoute from './routes/excel-route.js';
import stripeRoute from './routes/stripe-route.js';
import superAdminData from './routes/superadmin-data-route.js';
import awsS3Route from './routes/awsS3-route.js';
// import openAIRoute from './routes/open-ai-route.js';
import sendEmailRoute from './routes/sendEmail-route.js';
import sendSurveyCountRoute from './routes/survey-count-route.js';
import bodyParser from 'body-parser';
import stripe from 'stripe';
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv';
dotenv.config();
const prisma = new PrismaClient();
const Stripe = stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
// app.set('trust proxy', true);
app.use(cors(corsOptions));

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
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
              userEmail: chargeUpdated.metadata.emailId,
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

});


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute)
app.use('/api/survey', surveyRoute)
app.use('/api/user-response-survey', userResponseSurveyRoute)
app.use('/api/stripe', stripeRoute)
app.use('/api/excel', excelRoute)
app.use('/api/superadmin-data', superAdminData)
app.use('/api/s3', awsS3Route)
app.use('/api/send-email', sendEmailRoute)
app.use('/api/survey-count', sendSurveyCountRoute)
// app.use('/api/open-api', openAIRoute)



app.use(errorHandler);
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Backend running at port ${PORT}`);
})