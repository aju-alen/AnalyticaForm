import express from 'express';
const router = express.Router();
import { apiCallLimiter } from '../middleware/rateLimiter.js'
import {getSingleSurveyDataForUser,postSingleSurveyDataForUser} from '../controllers/user-response-survey-controller.js'

router.get('/get-one-survey/user/:surveyId',apiCallLimiter, getSingleSurveyDataForUser); // get survey data of a particular survey for customers who are filling the survey

router.post('/submit-survey/:surveyId',apiCallLimiter, postSingleSurveyDataForUser); // submit survey data of a particular survey for customers who are filling the survey

export default router;