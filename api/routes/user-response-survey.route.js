import express from 'express';
const router = express.Router();
import { apiCallLimiter } from '../middleware/rateLimiter.js'
import {
    getSingleSurveyDataForUser,
    postSingleSurveyDataForUser,
    postDefenceReadinessInterimSummaryForUser,
    getDefenceReadinessInterimResponseForUser,
} from '../controllers/user-response-survey-controller.js'

router.get('/get-one-survey/user/:surveyId',apiCallLimiter, getSingleSurveyDataForUser); // get survey data of a particular survey for customers who are filling the survey

router.post('/submit-survey/:surveyId',apiCallLimiter, postSingleSurveyDataForUser); // submit survey data of a particular survey for customers who are filling the survey
router.post('/submit-dri-interim/:surveyId', apiCallLimiter, postDefenceReadinessInterimSummaryForUser); // save first 10 defence readiness answers for interim summary email
router.get('/dri-interim-response/:surveyId/:responseId', apiCallLimiter, getDefenceReadinessInterimResponseForUser); // fetch interim response by responseId to continue Q11-Q50

export default router;