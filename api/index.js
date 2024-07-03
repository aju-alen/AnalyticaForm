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
// import superAdminData from './routes/superadmin-data-route.js';
import bodyParser from 'body-parser';
import stripe from 'stripe';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();
const Stripe = stripe(process.env.STRIPE_SECRET_KEY);

const app = express();
// app.set('trust proxy', true);
app.use(cors(corsOptions)); 

app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }),async (request, response) => {
    const endpointSecret = "whsec_WwO4P8KQsXS1gzpfzMD8DKJUWxmder4H";
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
        break;
      case 'checkout.session.async_payment_succeeded':
        const checkoutSessionAsyncPaymentSucceeded = event.data.object;
        console.log(checkoutSessionAsyncPaymentSucceeded,'checkoutSessionAsyncPaymentSucceeded');
        break;


      case 'checkout.session.completed':
        const checkoutSessionCompleted = event.data.object; //--This is run when the payment is successful

        console.log(checkoutSessionCompleted,'checkoutSessionCompleted');
        break;

        case 'customer.subscription.deleted':
          const customerSubscriptionDeleted = event.data.object;
          // Then define and call a function to handle the event customer.subscription.deleted
          console.log(customerSubscriptionDeleted,'customerSubscriptionDeleted');
          break;

      case 'invoice.created':
        const invoiceCreated = event.data.object;
        console.log(invoiceCreated,'invoiceCreated');
        break;
      case 'invoice.payment_succeeded': //--This is run when the payment is successful
        const invoicePaymentSucceeded = event.data.object;
        const findCustomer = await prisma.proMember.findUnique({
          where: { subscriptionEmail: invoicePaymentSucceeded.customer_email }
      });

      if(findCustomer){

        const updateSubscription = await prisma.proMember.update({
          where : {subscriptionEmail : invoicePaymentSucceeded.customer_email},
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
        console.log(updateSubscription, 'updateSubscription in invoice succeed');
      }
      else{
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
app.use('/api/stripe',stripeRoute)
app.use('/api/excel',excelRoute)
// app.use('/api/superadmin-data',superAdminData)



app.use(errorHandler);
const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log(`Backend running at port ${PORT}`);
})