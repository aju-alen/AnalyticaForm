import express from 'express';
const router = express.Router();
import { userRegister,login,refresh,logout,test,verifyEmail,forgetPassword,resetPassword } from '../controllers/auth-controllers.js';
import { apiCallLimiter } from '../middleware/rateLimiter.js'
import { verifyJwt } from '../middleware/verifyJwt.js';

//user registration
router.post('/register',apiCallLimiter,userRegister);

router.get('/verify/:token', verifyEmail); //verify email logic 

router.post('/forget-password', forgetPassword); //verify email logic 

router.post('/reset/:resetToken',resetPassword)

//login
router.post('/login',apiCallLimiter,login);

//refreshtoken
router.get('/refresh',refresh);

//logout
router.post('/logout',logout);

//Testing route
router.get('/test',apiCallLimiter,verifyJwt,test);

export default router;