import express from 'express';
const router = express.Router();
import { userRegister,login,refresh,logout,test } from '../controllers/auth-controllers.js';
import { apiCallLimiter } from '../middleware/rateLimiter.js'
import { verifyJwt } from '../middleware/verifyJwt.js';

//user registration
router.post('/register',apiCallLimiter,userRegister);

//login
router.post('/login',apiCallLimiter,login);

//refreshtoken
router.get('/refresh',refresh);

//logout
router.post('/logout',logout);

//Testing route
router.get('/test',apiCallLimiter,verifyJwt,test);

export default router;