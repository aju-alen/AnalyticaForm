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

            if (!user) {
                return res.status(400).json({ message: "User registration failed. Please try again" });
            }

            try {
                await sendVerificationEmail(req.body.email, emailVerificationToken, firstName);
                res.status(201).json({ message: "User registered successfully. Please verify your details by email." });
            } catch (emailError) {
                // If email sending fails, we should still keep the user record but inform them
                console.error("Failed to send verification email:", emailError);
                res.status(201).json({ 
                    message: "User registered successfully, but we couldn't send the verification email. Please contact support.",
                    error: "EMAIL_SEND_FAILED"
                });
            }

        } catch (err) {
            console.error("Registration error:", err);
            res.status(500).json({ 
                message: "An error occurred during registration. Please try again or contact support.",
                error: "REGISTRATION_FAILED"
            });
        } finally {
            await prisma.$disconnect();
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

    const emailConfig = {
        host: 'mail.dubaianalytica.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.GMAIL_AUTH_USER_SUPPORT,
            pass: process.env.GMAIL_AUTH_PASS
        }
    };

    // not a route controller, function to send verification email
    const sendVerificationEmail = async (email, verificationToken, name) => {
        try {
            const transporter = nodemailer.createTransport(emailConfig);
            
            const mailOptions = {
                from: process.env.GMAIL_AUTH_USER_SUPPORT,
                to: email,
                subject: 'Verify Your Email Address',
                html: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333333;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
            }
            .header {
                text-align: center;
                padding: 20px 0;
                background-color: #ffffff;
            }
            .logo {
                max-width: 200px;
                height: auto;
            }
            .content {
                padding: 30px 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                border-radius: 4px;
                margin: 20px 0;
                font-weight: bold;
            }
            .button:hover {
                background-color: #0056b3;
            }
            .footer {
                text-align: center;
                padding: 20px;
                font-size: 12px;
                color: #666666;
            }
            .verification-link {
                word-break: break-all;
                color: #007bff;
                text-decoration: none;
            }
            .divider {
                border-top: 1px solid #eeeeee;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/NavbarLogo.png" alt="Dubai Analytica Logo" class="logo">
            </div>
            <div class="content">
                <h2 style="color: #333333; margin-bottom: 20px;">Welcome to Dubai Analytica!</h2>
                <p>Hi ${name},</p>
                <p>You're just one step away from accessing your Dubai Analytica account. We need to verify your email address to ensure the security of your account.</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${backendUrl}/api/auth/verify/${verificationToken}" class="button">VERIFY YOUR EMAIL</a>
                </div>

                <div class="divider"></div>

                <p style="font-size: 14px; color: #666666;">If the button above doesn't work, copy and paste this link into your browser:</p>
                <p style="font-size: 14px; background-color: #f8f9fa; padding: 10px; border-radius: 4px;">
                    <a href="${backendUrl}/api/auth/verify/${verificationToken}" class="verification-link">
                        ${backendUrl}/api/auth/verify/${verificationToken}
                    </a>
                </p>
            </div>
            <div class="footer">
                <p>This is an automated message, please do not reply to this email.</p>
                <p>© ${new Date().getFullYear()} Dubai Analytica. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>`
            };

            const response = await transporter.sendMail(mailOptions);
            console.log("Verification email sent successfully", response);
            return true;
        } catch (err) {
            console.error("Error sending verification email:", err);
            throw new Error(`Failed to send verification email: ${err.message}`);
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
                return res.redirect(`https://app.dubaianalytica.com/login`);
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
            res.redirect(`https://app.dubaianalytica.com/login`);
        }
        catch (err) {
            console.log(err);
            res.json({message: "An error has occoured"});
        }
    }

    const sendWelcomeEmail = async (email, name) => {

        const transporter = nodemailer.createTransport(emailConfig);
        const mailOptions = {
            from: process.env.GMAIL_AUTH_USER_SUPPORT,
            to: email,
            subject: 'Welcome to Dubai Analytica',
            html: `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333333;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
            }
            .header {
                text-align: center;
                padding: 20px 0;
                background-color: #ffffff;
            }
            .logo {
                max-width: 200px;
                height: auto;
            }
            .content {
                padding: 30px 20px;
                background-color: #ffffff;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .welcome-message {
                font-size: 24px;
                color: #2c3e50;
                margin-bottom: 20px;
                font-weight: bold;
            }
            .features {
                margin: 30px 0;
                padding: 20px;
                background-color: #f8f9fa;
                border-radius: 8px;
            }
            .feature-item {
                margin: 15px 0;
                padding-left: 25px;
                position: relative;
            }
            .feature-item:before {
                content: "✓";
                color: #28a745;
                position: absolute;
                left: 0;
                font-weight: bold;
            }
            .button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                border-radius: 4px;
                margin: 20px 0;
                font-weight: bold;
            }
            .button:hover {
                background-color: #0056b3;
            }
            .footer {
                text-align: center;
                padding: 20px;
                font-size: 12px;
                color: #666666;
                border-top: 1px solid #eeeeee;
                margin-top: 30px;
            }
            .divider {
                border-top: 1px solid #eeeeee;
                margin: 20px 0;
            }
            .team-signature {
                font-style: italic;
                color: #666666;
                margin: 20px 0;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/NavbarLogo.png" alt="Dubai Analytica Logo" class="logo">
            </div>
            <div class="content">
                <div class="welcome-message">Welcome to Dubai Analytica!</div>
                
                <p>Hi ${name},</p>
                <p>We're thrilled to have you join our community! Your Dubai Analytica account is now ready to use.</p>

                <div class="features">
                    <div class="feature-item">Create and customize forms with ease</div>
                    <div class="feature-item">Share forms with anyone, no sign-up required</div>
                    <div class="feature-item">Collect and analyze responses efficiently</div>
                    <div class="feature-item">Access powerful analytics tools</div>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://app.dubaianalytica.com/login" class="button">ACCESS YOUR ACCOUNT</a>
                </div>

                <div class="team-signature">
                    <p>Best regards,<br>The Dubai Analytica Team</p>
                </div>

                <div class="divider"></div>

                <div class="footer">
                    <p>Copyright © ${new Date().getFullYear()} Dubai Analytica. All rights reserved.</p>
                    <p>This email was sent to ${email}. If you have any questions, please contact our support team.</p>
                    <p style="font-size: 11px; color: #999999; margin-top: 15px;">
                        By using Dubai Analytica, you agree to our Terms of Service and Privacy Policy. 
                        We use cookies to enhance your experience and improve our services.
                    </p>
                </div>
            </div>
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

        const transporter = nodemailer.createTransport(emailConfig);
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
        const transporter = nodemailer.createTransport(emailConfig);
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
            <p>We hope you're finding our survey tool valuable for your research! We wanted to inform you that your survey, " ${title}," is approaching the response limit of ${response}.</p>
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