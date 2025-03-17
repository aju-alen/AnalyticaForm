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
import vertexGoogleApi from './routes/open-ai-route.js';
import sendEmailRoute from './routes/sendEmail-route.js';
import sendSurveyCountRoute from './routes/survey-count-route.js';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { htmlMessage,healthCheckMessage } from './utils/static/static-data.js';
import { dynamicMetaHtml } from './controllers/dynamic-html-preview-controller.js';
dotenv.config();


const app = express();
// app.set('trust proxy', true);
app.use(cors(corsOptions));

app.post('/api/stripe', express.raw({type: 'application/json'}), stripeRoute);

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send(htmlMessage);
});

app.use('/api/auth', authRoute)
app.use('/api/survey', surveyRoute)
app.use('/api/user-response-survey', userResponseSurveyRoute)
app.use('/api/stripe', stripeRoute)
app.use('/api/excel', excelRoute)
app.use('/api/superadmin-data', superAdminData)
app.use('/api/s3', awsS3Route)
app.use('/api/send-email', sendEmailRoute)
app.use('/api/survey-count', sendSurveyCountRoute)
app.use('/api/google-vertex', vertexGoogleApi)
app.get('/survey-meta/:surveyId', dynamicMetaHtml)

app.get('/health', (req, res) => {
  res.status(200).json(healthCheckMessage);
  console.log('Health check passed');
});



app.use(errorHandler);
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Backend running at port ${PORT}`);
})