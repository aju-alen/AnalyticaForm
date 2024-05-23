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
import bodyParser from 'body-parser';
import stripe from 'stripe';
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



app.use(errorHandler);
const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log(`Backend running at port ${PORT}`);
})