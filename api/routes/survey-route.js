import express from 'express';
const router = express.Router();
import { createNewSurvey,getUserSurvey,getSurveyById,updateSurveyById,getAllSurveyResponse,getAllSurveyOfOneUser,updateUserView,deleteUserSurvey,updateUserStatus, getIpOfSingleSurvey, getSurveyResponsesPaginated} from '../controllers/survey-controller.js';
import { apiCallLimiter } from '../middleware/rateLimiter.js'
import { verifyJwt } from '../middleware/verifyJwt.js';

router.post('/create',apiCallLimiter,verifyJwt, createNewSurvey);
router.get('/get-all-survey',apiCallLimiter,verifyJwt, getUserSurvey); // get all survey of user
router.get('/get-one-survey/:surveyId',apiCallLimiter,verifyJwt, getSurveyById); // get one survey data of the user

router.get('/get-ip-single-survey/:surveyId',apiCallLimiter,verifyJwt, getIpOfSingleSurvey); // get all user ip address of a single survey 

router.put('/get-one-survey/:surveyId',apiCallLimiter,verifyJwt, updateSurveyById); // update one survey data of the user
router.get('/get-all-user-response/:surveyId/:isSubscribed',apiCallLimiter,verifyJwt, getAllSurveyResponse); // Get all the user response of a particular survey
router.get('/get-user-response-paginated/:surveyId',apiCallLimiter,verifyJwt, getSurveyResponsesPaginated); // Get paginated user responses of a particular survey
router.get('/get-all-sruvey-from-oneuser/:userId',apiCallLimiter,verifyJwt, getAllSurveyOfOneUser); // Get all the survey of a particular user
router.put('/update-user-view/:surveyId',apiCallLimiter, updateUserView); // Get all the survey of a particular user

router.delete('/delete-survey/:surveyId',apiCallLimiter,verifyJwt, deleteUserSurvey); // Get all the survey of a particular user
router.put('/update-survey-status/:surveyId',apiCallLimiter,verifyJwt, updateUserStatus)


export default router;