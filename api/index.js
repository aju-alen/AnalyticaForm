import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler.js';
import { corsOptions } from './utils/corsFe.js';
import authRoute from './routes/auth-route.js';
import surveyRoute from './routes/survey-route.js';

const app = express();

app.use(cors(corsOptions)); 
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute)
app.use('/api/survey', surveyRoute)



app.use(errorHandler);
const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log(`Backend running at port ${PORT}`);
})