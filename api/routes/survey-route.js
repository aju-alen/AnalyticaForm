import express from 'express';
const router = express.Router();
import { createNewSurvey,getUserSurvey,getSurveyById,updateSurveyById,getSurveyDataForSurvey} from '../controllers/survey-controller.js';
import { apiCallLimiter } from '../middleware/rateLimiter.js'
import { verifyJwt } from '../middleware/verifyJwt.js';

router.post('/create',apiCallLimiter,verifyJwt, createNewSurvey);
router.get('/get-all-survey',apiCallLimiter,verifyJwt, getUserSurvey); // get all survey of user
router.get('/get-one-survey/:surveyId',apiCallLimiter,verifyJwt, getSurveyById); // get one survey data of the user
router.put('/get-one-survey/:surveyId',apiCallLimiter,verifyJwt, updateSurveyById); // update one survey data of the user
router.get('/get-one-survey/customer/:surveyId',apiCallLimiter, getSurveyDataForSurvey); // get survey data for customers who are filling the survey

export default router;