import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";
import crypto from "crypto";
import { backendUrl } from '../utils/backendUrl.js';
import { frontendURL } from '../utils/corsFe.js';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

const prisma = new PrismaClient();

import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_LOGIN_CLIENT_ID); // Use your Google Client ID

export const googleLogin = async (req, res) => {
    const { token } = req.body;

    try {
        // Verify the token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_LOGIN_CLIENT_ID, // Specify the Client ID
        });


        const payload = ticket.payload;
        console.log(payload, 'payload');

        const userId = payload.sub; // User ID from Google
        const email = payload.email;
        const firstName = payload.given_name;
        const lastName = payload.family_name;


        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });

        if (!user) {
            const newUser = await prisma.user.create({
                data: {
                    id: userId,
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    emailVerified: true,
                    receiveMarketingEmails: false,
                    emailVerificationToken: '',
                    emailVerified: true,
                    isGoogleUser: true
                }
            });


            // Check if the user exists in your database
            // If not, create a new user record

            // Create a session or JWT token for your application
            const accessToken = jwt.sign({ email: email, id: userId, isAdmin: 'false', firstName: firstName, isSuperAdmin: 'false' },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' });

            const refreshToken = jwt.sign({ email: email, id: userId, isAdmin: 'false', firstName: firstName },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '12h' }
            );

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true, //cookie cannot be accessed by client side
                secure: true, //https
                sameSite: 'none', //different domain can access
                maxAge: 1000 * 60 * 60 * 12, //12 hrs
            });

            res.status(200).json({ accessToken, message: "Login successful", email: email, id: userId, firstName: firstName, isAdmin: 'false', isSuperAdmin: 'false' });

        } 
    }
        catch (error) {
            console.error('Error verifying Google token:', error);
            res.status(401).json({ message: 'Unauthorized' });
        }

    
}





export const userRegister = async (req, res, next) => {
        const { firstName, lastName, email, password, receiveMarketingEmails } = req.body;

        try {

            // Check if all fields are filled
            if (!firstName || !lastName || !email || !password) {
                return res.status(400).json({ message: "Please fill all the fields" });
            }
            const userExists = await prisma.user.findUnique({
                where: {
                    email
                }
            });
            if (userExists) {
                return res.status(400).json({ message: "User already exists. You can login" });
            }

            const lowercaseEmail = email.toLowerCase();
            const hashedPassword = await bcrypt.hash(password, 10);
            const emailVerificationToken = crypto.randomBytes(64).toString('hex');

            const user = await prisma.user.create({
                data: {
                    email: lowercaseEmail,
                    password: hashedPassword,
                    firstName,
                    lastName,
                    receiveMarketingEmails,
                    emailVerificationToken
                }
            });
            await prisma.$disconnect();
            if (!user) {
                return res.status(400).json({ message: "User registration failed. please try again" });
            }
            sendVerificationEmail(req.body.email, emailVerificationToken, firstName);

            res.status(201).json({ message: "User registered successfully. Please verify your details by email." });


        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "An error has occoured, please contact support" });
        }
    };

    export const createRegisterGuest = async (req, res) => {
        try{
            const {email,firstName,lastName} = req.body;
            const userExists = await prisma.user.findUnique({
                where: {
                    email
                }
            })
            if(userExists){
                return res.status(400).json({ message: "User already exists. You can login" });
            }
            const newUser = await prisma.user.create({
                data: {
                    email,
                    firstName,
                    lastName,
                    receiveMarketingEmails: true,
                    emailVerificationToken: crypto.randomBytes(64).toString('hex'),
                    isGuest: true,
                }
            })
            await prisma.$disconnect();
            if(!newUser){
                return res.status(400).json({ message: "User registration failed. please try again" });
            }
            sendVerificationEmail(req.body.email, newUser.emailVerificationToken, 'Guest');
            res.status(201).json({ message: "User registered successfully. Please verify your details by email.",user: newUser });
            
            
        }
        catch(err){
            console.log(err);

            res.status(500).json({ message: "An error has occoured, please contact support" });
        }
    }

    const createTransport = nodemailer.createTransport({
        host: 'mail.privateemail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.GMAIL_AUTH_USER_SUPPORT,
            pass: process.env.GMAIL_AUTH_PASS
        }
    })

    // not a route controller, function to send verification email
    const sendVerificationEmail = async (email, verificationToken, name) => {

        const transporter = createTransport;
        console.log(transporter, 'transporter');
        const mailOptions = {
            from: process.env.GMAIL_AUTH_USER_SUPPORT,
            to: email,
            subject: 'Verify Your Email Address',
            html: `
    <html>
    <body>
        <div>

            <img src="https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/NavbarLogo.png" alt="email verification" style="display:block;margin:auto;width:50%;" />
            <p>Dubai Analytica</p>

        </div>
        <div>
            <p>Hi ${name},</p>
            <p>You're almost there.</p>
            <br>
            <p>We just need to verify your email address before you can access your Dubai Analytica account. Verifying your email address helps secure your account.</p>
            <br>
            <p><a href="${backendUrl}/api/auth/verify/${verificationToken}">VERIFY YOUR EMAIL</a></p>
            <br>
            <p>Cannot verify your email by clicking the button? Copy and paste the URL into your browser to verify your email.</p>
            <br>
            <p>${backendUrl}/api/auth/verify/${verificationToken}</p>
        </div>
    </body>
    </html>`
        }

        //send the mail
        try {
            const response = await transporter.sendMail(mailOptions);
            console.log("Verification email sent", response);
        }
        catch (err) {
            console.log("Err sending verification email", err);
        }
    }

    export const verifyEmail = async (req, res) => {
        try {

            const emailVerificationToken = req.params.token;
            console.log(emailVerificationToken, 'emailVerificationToken');
            const userToken = await prisma.user.findFirst({
                where: {
                    emailVerificationToken: emailVerificationToken
                }
            })
            console.log(userToken, 'userToken');
            if (!userToken) {
                return res.status(400).json({ message: 'Invalid token or verification has been complete. Please login' })
            }

            const updatedUser = await prisma.user.update({
                where: {
                    id: userToken.id
                },
                data: {
                    emailVerified: true,
                    emailVerificationToken: ''
                }
            })
            await prisma.$disconnect()
            sendWelcomeEmail(updatedUser.email, updatedUser.firstName);
            console.log(updatedUser, 'updatedUser');
            res.redirect(`${frontendURL}/login`);
        }
        catch (err) {
            console.log(err);
            res.status(400).send('An error occoured')
        }
    }

    const sendWelcomeEmail = async (email, name) => {

        const transporter = createTransport;
        const mailOptions = {
            from: process.env.GMAIL_AUTH_USER_SUPPORT,
            to: email,
            subject: 'Welcome to Dubai Analytica',
            html: `
    <html>
    <body>
        <div>

            <img src="https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/NavbarLogo.png" alt="Welcome Email" style="display:block;margin:auto;width:50%;" />
            <p>Dubai Analytica</p>

        </div>
        <div>
            <p>Welcome ${name},</p>
            <p>With your Dubai Analytica account you can sign in, create forms and send it to anyone you like without them having to sign up. It is that simple!.</p>
            <br>
            <p>The Dubai Analytica Team</p>
            <br>
            <p><a href="${process.env.FRONTEND_URL}">View Your Dubai Analytica Account</a></p>
            <br>
            <p>--------------------</p>
            <p>Copyright © 2024, Dubai Analytica, its licensors and distributors. All rights are reserved, including those for text and data mining.</p>
            <br>
            
            <p>We use cookies to help provide and enhance our service. By continuing you agree to the use of cookies.</p>
        </div>
    </body>
    </html>`
        }

        //send the mail
        try {
            const response = await transporter.sendMail(mailOptions);
            console.log("Verification email sent", response);
        }
        catch (err) {
            console.log("Err sending verification email", err);
        }
    }

    export const login = async (req, res, next) => {
        const { email, password } = req.body;
        try {
            if (!email || !password) {
                return res.status(400).json({ message: "Please fill all the fields" });
            }

            const user = await prisma.user.findUnique({
                where: {
                    email
                }
            });
            await prisma.$disconnect();
            if (!user) {
                return res.status(400).json({ message: "There exist no email in this application. You can register as a new account." });
            }
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(400).json({ message: "Invalid password. Try again." });
            }
            if (passwordMatch && user && !user.emailVerified) {
                return res.status(401).json({ message: "You have not verified your email. Please check for your verification email on your registered inbox. If you feel there is somethig wrong, contact us." })
            }


            const accessToken = jwt.sign({ email: user.email, id: user.id, isAdmin: user.isAdmin, firstName: user.firstName, isSuperAdmin: user.isSuperAdmin },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' });

            const refreshToken = jwt.sign({ email: user.email, id: user.id, isAdmin: user.isAdmin, firstName: user.firstName },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '12h' }
            );

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true, //cookie cannot be accessed by client side
                secure: true, //https
                sameSite: 'none', //different domain can access
                maxAge: 1000 * 60 * 60 * 12, //12 hrs
            });

            res.status(200).json({ accessToken, message: "Login successful", email: user.email, id: user.id, firstName: user.firstName, isAdmin: user.isAdmin, isSuperAdmin: user.isSuperAdmin });
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "An error has occoured" });
        }
    };

    export const refresh = async (req, res, next) => {

        const cookies = req.cookies;

        if (!cookies.refreshToken) {
            return res.status(401).json({ message: "You are not authenticated" });
        }

        const refreshToken = cookies.refreshToken;

        jwt.verify(refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) {
                    return res.status(403).json({ message: "Invalid token" });
                }
                const foundUser = await prisma.user.findUnique({
                    where: {
                        email: decoded.email
                    }
                });
                if (!foundUser) {
                    return res.status(401).json({ message: "Unauthorized User" });
                }

                const accessToken = jwt.sign(
                    {
                        email: foundUser.email,
                        id: foundUser.id,
                        isAdmin: foundUser.isAdmin,
                        firstName: foundUser.firstName
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '1h' }
                )
                res.json({ accessToken, message: "Trefreshed", email: foundUser.email, id: foundUser.id, firstName: foundUser.firstName, isAdmin: foundUser.isAdmin });
            });

    }

    export const logout = async (req, res, next) => {
        try {
          const cookies = req.cookies;
          
          if (!cookies.refreshToken) {
            return res.status(204).send(); 
          }
          res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true, 
            sameSite: 'none',
          });
          res.json({ message: "Logout successful, cookie has been cleared" });
        } catch (err) {
          console.error("Logout error:", err); // More specific logging
          res.status(500).json({ message: "An error occurred during logout" });
        }
      };
      

    //just for testing purpose of the middleware
    export const test = async (req, res, next) => {

        res.json({ message: "Test successful" });
    }

    export const forgetPassword = async (req, res, next) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: req.body.email
                }

            })
            if (!user) {
                return res.status(400).json({ message: 'User does not exist' })
            }
            const resetToken = crypto.randomBytes(32).toString('hex');
            await prisma.user.update({
                where: {
                    email: req.body.email
                },
                data: {
                    resetToken: resetToken
                }
            })
            console.log("reached");
            await prisma.$disconnect()
            console.log(req.body.email, resetToken, user.surname, 'user in forget password');
            sendResetPassword(req.body.email, resetToken, user.firstName);
            res.status(200).json({ message: 'Password reset link sent to your email' })
        }
        catch (err) {
            console.log(err);
            res.status(400).send('An error occoured')
        }
    }

    const sendResetPassword = async (email, resetToken, name) => {

        const transporter = createTransport;
        const mailOptions = {
            from: process.env.GMAIL_AUTH_USER_SUPPORT,
            to: email,
            subject: 'Reset Password',
            html: `
    <html>
    <body>
        <div>
            <img src="https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/NavbarLogo.png" alt="Reset Password" style="display:block;margin:auto;width:50%;" />
        </div>
        <div>
            <p>Hi ${name},</p>
            <p>Click to reset your password:</p>
            <p><a href="https://dubaianalytica.com/reset-password/${resetToken}">Reset Password</a></p>
        </div>
    </body>
    </html>`
        }

        //send the mail
        try {
            const response = await transporter.sendMail(mailOptions);
            console.log("Reset Password email sent", response);
        }
        catch (err) {
            console.log("Err sending Reset Password email", err);
        }
    }

    export const resetPassword = async (req, res) => {
        const resetToken = req.params.resetToken;
        console.log(resetToken, 'resetToken');
        console.log(req.body.password, 'password');
        try {
            const user = await prisma.user.findFirst({
                where: {
                    resetToken,
                }
            });

            if (!user) {
                return res.status(400).json({ message: 'Invalid token' })
            }
            const hash = await bcrypt.hash(req.body.password, 10);
            await prisma.user.update({
                where: {
                    resetToken: resetToken,
                },
                data: {
                    password: hash,
                }
            })
            await prisma.$disconnect()
            res.status(200).json({ message: 'Password reset successful' })

        }
        catch (err) {
            console.log(err);
            res.status(400).send('An error occoured')
        }

    }

    export const getUserData = async (req, res) => {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: req.tokenId
                },
                select: {
                    id: true,
                    isSuperAdmin: true,
                    email: true,
                    firstName: true,
                }
            })
            await prisma.$disconnect()
            res.status(200).json(user)

        }
        catch (err) {
            console.log(err);
            res.status(400).send('An error occoured')
        }
    }

    export const getUserIsProMember = async (req, res) => {
        const { userId } = req.params;
        try {
            const user = await prisma.proMember.findFirst({
                where: {
                    userId: userId
                },
                select: {
                    subscriptionPeriodEnd: true
                }
            })
            await prisma.$disconnect()
            res.status(200).json(user)

        }
        catch (err) {
            console.log(err);
            res.status(400).send('An error occoured')
        }
    }

    export const updateUserResponseLimit = async (name, email, title, response) => {
        const transporter = createTransport;
        const mailOptions = {
            from: process.env.GMAIL_AUTH_USER_SUPPORT,
            to: email,
            subject: 'Your Survey is Almost at Capacity - Keep Track of Responses!',
            html: `
    <html>
    <body>
        <div>

            <img src="https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/NavbarLogo.png" alt="Welcome Email" style="display:block;margin:auto;width:50%;" />
            <p>Dubai Analytica</p>

        </div>
        <div>
            <p>Dear ${name},</p>
            <p>We hope you're finding our survey tool valuable for your research! We wanted to inform you that your survey, “${title},” is approaching the response limit of ${response}.</p>
            <br>
            <p>Current Response Count: ${response}</p>
            <br>
            <p>With just [500 - Current Count: ${response}] responses left, now might be a good time to review your results or consider how you want to proceed. If you need additional features or more responses, we have a range of plans to suit your needs.</p>
            <br>
            <p>If you have any questions or need assistance, please don't hesitate to reach out.</p>
            <br>
            <p>Thank you for using Dubai Analytica, the best survey software that helps UAE-based companies and individual teams with audience surveys.</p>
            <br>
            <br>
            <p>Best regards,</p>
            <br>
            <p>Dubai Analytica Team</p>
            <p>Dubai Analytica</p>
            <p>Innovation Hub, Level 1, South Zone - Gate Avenue, DIFC, PO Box 00000, Dubai, UAE</p>
        </div>
    </body>
    </html>`
        }

        try {
            const response = await transporter.sendMail(mailOptions);
            console.log("Response limit email sent", response);

        }
        catch (err) {
            console.log(err);
        }
    }