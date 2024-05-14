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

const app = express();

// app.set('trust proxy', true);
app.use(cors(corsOptions)); 
app.use(bodyParser.urlencoded({ extended: true }));
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