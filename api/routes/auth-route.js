import express from 'express';
const router = express.Router();
import { userRegister,login,refresh,logout,test } from '../controllers/auth-controllers.js';
import { loginLimiter } from '../middleware/loginLimiter.js';
import { verifyJwt } from '../middleware/verifyJwt.js';

//user registration
router.post('/register',loginLimiter,userRegister);

//login
router.post('/login',loginLimiter,login);

//refreshtoken
router.get('/refresh',refresh);

//logout
router.post('/logout',logout);

//Test
router.get('/test',loginLimiter,verifyJwt,test);


export default router;