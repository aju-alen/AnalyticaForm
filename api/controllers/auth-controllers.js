import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from "nodemailer";
import crypto from "crypto";
import { backendUrl } from '../utils/backendUrl.js';
const prisma = new PrismaClient();


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

const createTransport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_AUTH_USER,
        pass: process.env.GMAIL_AUTH_PASS
    }
})

// not a route controller, function to send verification email
const sendVerificationEmail = async (email, verificationToken, name) => {
    console.log(process.env.GMAIL_AUTH_USER);
    console.log(process.env.GMAIL_AUTH_PASS);

    const transporter = createTransport;
    console.log(transporter, 'transporter');
    const mailOptions = {
        from: process.env.GMAIL_AUTH_USER,
        to: email,
        subject: 'Verify Your Email Address',
        html: `
    <html>
    <body>
        <div>

            <img src="https://i.postimg.cc/8cpfZ5sP/215b7754-0e37-41b2-be2f-453d190af861.jpg" alt="email verification" style="display:block;margin:auto;width:50%;" />
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
            return res.status(400).json({ message: 'Invalid token' })
        }
    
       const updatedUser =  await prisma.user.update({
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
        res.status(200).send("Your email has been verified!")
    }
    catch (err) {
        console.log(err);
        res.status(400).send('An error occoured')
    }
}

const sendWelcomeEmail = async (email,name) => {

    const transporter = createTransport;
    const mailOptions = {
        from: process.env.GMAIL_AUTH_USER,
        to: email,
        subject: 'Welcome to Dubai Analytica',
        html: `
    <html>
    <body>
        <div>

            <img src="https://i.postimg.cc/8cpfZ5sP/215b7754-0e37-41b2-be2f-453d190af861.jpg" alt="Welcome Email" style="display:block;margin:auto;width:50%;" />
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

////////////////////////////////////////////
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
        if(passwordMatch && user && !user.emailVerified){
            return res.status(401).json({message:"You have not verified your email. Please check for your verification email on your registered inbox."})
        }


        const accessToken = jwt.sign({ email: user.email, id: user.id, isAdmin: user.isAdmin, firstName: user.firstName },
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

        res.status(200).json({ accessToken, message: "Login successful", email: user.email, id: user.id, firstName: user.firstName, isAdmin: user.isAdmin });
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
        async(err, decoded) => {
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
            return res.status(204)
        }
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        })
        res.json({ message: "Logout successful, Cookie has been cleared" })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error has occoured" })

    }
}

//just for testing purpose of the middleware
export const test = async (req, res, next) => {

    res.json({ message: "Test successful" });
}

export const forgetPassword = async(req,res,next)=>{
    try{
        const user = await prisma.user.findUnique({
            where:{
                email:req.body.email
            }

        })
        if(!user){
            return res.status(400).json({message:'User does not exist'})
        }
        const resetToken = crypto.randomBytes(32).toString('hex');
        await prisma.user.update({
            where:{
                email:req.body.email
            },
            data:{
                resetToken:resetToken
            }
        })
        console.log("reached");
        await prisma.$disconnect()
        console.log(req.body.email,resetToken,user.surname, 'user in forget password');
        sendResetPassword(req.body.email, resetToken, user.firstName);
        res.status(200).json({message:'Password reset link sent to your email'})
    }
    catch(err){
        console.log(err);
        res.status(400).send('An error occoured')
    }
}

const sendResetPassword = async (email, resetToken, name) => {

    const transporter = createTransport;
    const mailOptions = {
        from: process.env.GMAIL_AUTH_USER,
        to: email,
        subject: 'Reset Password',
        html: `
    <html>
    <body>
        <div>
            <img src="https://i.postimg.cc/8cpfZ5sP/215b7754-0e37-41b2-be2f-453d190af861.jpg" alt="Reset Password" style="display:block;margin:auto;width:50%;" />
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

        if(!user){
            return res.status(400).json({message:'Invalid token'})
        }
        const hash = await bcrypt.hash(req.body.password, 10);
        await prisma.user.update({
            where:{
                resetToken:resetToken,
            },
            data:{
                password:hash,
            }
        })
        await prisma.$disconnect()
        res.status(200).json({message:'Password reset successful'}) 

    }
    catch (err) {
        console.log(err);
        res.status(400).send('An error occoured')
    }
      
}