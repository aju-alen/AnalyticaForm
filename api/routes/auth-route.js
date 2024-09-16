import express from 'express';
const router = express.Router();
import { userRegister,login,refresh,logout,test,verifyEmail,forgetPassword,resetPassword,getUserData,getUserIsProMember,googleLogin } from '../controllers/auth-controllers.js';
import { apiCallLimiter } from '../middleware/rateLimiter.js'
import { verifyJwt } from '../middleware/verifyJwt.js';

//user registration
router.post('/register',apiCallLimiter,userRegister);
router.post('/login',apiCallLimiter,login);
router.post('/logout',logout);
router.get('/refresh',refresh);

router.post('/forget-password', forgetPassword); //verify email logic 

router.get('/verify/:token', verifyEmail); //verify email logic 

router.post('/reset/:resetToken',resetPassword)

router.get('/get-user',apiCallLimiter,verifyJwt,getUserData);
router.get('/get-user-promember/:userId',apiCallLimiter,verifyJwt,getUserIsProMember);

router.post('/google-login',googleLogin);

//Testing route
router.get('/test',apiCallLimiter,verifyJwt,test);

export default router;