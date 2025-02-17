import nodemailer from "nodemailer";
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

const createTransport = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_AUTH_USER_SUPPORT,
        pass: process.env.GMAIL_AUTH_PASS
    }
})

export const contactUs = async (req, res) => {
    console.log(req.body, 'req.body');
    const {username, email, message,contact} = req.body;
    try{    

        contacUsEmail(username, email, message,contact);
        res.status(200).json({message: 'Email sent successfully'});
    }
    catch(err){
        console.log(err);
        res.status(500).send({message:'Internal server error'});
    }
};


const contacUsEmail = async (username, email, message,contact) => {
   

    const transporter = createTransport;
    console.log(transporter, 'transporter');
    const mailOptions = {
        from: process.env.GMAIL_AUTH_USER_SUPPORT,
        to: process.env.GMAIL_AUTH_USER_SUPPORT,
        subject: 'You have got a new query on Dubai Analytica',
        html: `
    <html>
    <body>
        <div>

            <img src="https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/NavbarLogo.png" alt="email verification" style="display:block;margin:auto;width:50%;" />
            <p>Dubai Analytica</p>

        </div>
        <div>
            <p>Hello Admin,</p>
            <p>You have received a new query on Dubai Analytica</p>
            <br>
            <p>Username : ${username}</p>
            <p>Sent From : ${email}</p>
            <p>Message : ${message}</p>
            <p>Contact : ${contact}</p>
            <br>
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

export const reportAbuse = async (req, res) => {
    console.log(req.body, 'req.body');
    const {email,comment} = req.body;
    const {surveyId} = req.params;
    
    try{    
      const getSurveyDetail = await prisma.survey.findUnique({
        where: {
            id: surveyId
            },
            select:{
                surveyTitle:true,
                user:{
                    select:{
                        email:true
                    }
                }
            }
      })
      console.log(getSurveyDetail, 'getSurveyDetail');
      

        reportAbuseEmailToAdmin(email,comment,getSurveyDetail.surveyTitle,getSurveyDetail.user.email);
        reportAbuseEmailConfirmation(email,comment,getSurveyDetail.surveyTitle,getSurveyDetail.user.email);
        // reportAbuseEmail(username, email, message,contact);
        res.status(200).json({message: 'Email sent successfully'});
    }
    catch(err){
        console.log(err);
        res.status(500).send({message:'Internal server error'});
    }
};

const reportAbuseEmailToAdmin = async (email,comment,surveyTitle,surveyOwner) => {
    const mailList = [`${process.env.GMAIL_AUTH_USER}`,`${process.env.GMAIL_AUTH_USER_SUPPORT}`];
    const transporter = createTransport;
    const mailOptions = {
        from: process.env.GMAIL_AUTH_USER_SUPPORT,
        to: mailList,
        subject: 'Report Abuse Email',
        html: `
    <html>
    <body>
        <div>

            <img src="https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/NavbarLogo.png" alt="email verification" style="display:block;margin:auto;width:50%;" />
            <p>Dubai Analytica</p>

        </div>
        <div>
            <p>Hello</p>
            <p>You have received a new Report abuse </p>
            <br>
            <p>Reported By :${email===''?'Anonymous':email}</p>
            <p>Message : ${comment}</p>
            <p>Survey Title : ${surveyTitle}</p>
            <p>Survey Owner : ${surveyOwner}</p>
            <br>
        </div>
    </body>
    </html>`
    }
    try{
        const response = await transporter.sendMail(mailOptions);
    }
    catch(err){
        console.log(err);
    }
}

const reportAbuseEmailConfirmation = async (email,comment,surveyTitle,surveyOwner) => {
    const transporter = createTransport;
    const mailOptions = {
        from: process.env.GMAIL_AUTH_USER_SUPPORT,
        to: email,
        subject: 'Report Abuse Email Submitted',
        html: `
    <html>
    <body>
        <div>

            <img src="https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/NavbarLogo.png" alt="email verification" style="display:block;margin:auto;width:50%;" />

        </div>
        <div>
            <p>Dear Participant,</p>
            <p>We have received your abuse report</p>
            <p>One of our representatives will get back to you shortly.</p>
            <p>Thank you for contributing to the responsible use of our platform and the safety of our community.</p>
            <br>
            <p>The Team at <a href="https://dubaianalytica.com/">Dubai Analytica</a></p>
        </div>
    </body>
    </html>`
    }
    try{
        const response = await transporter.sendMail(mailOptions);
    }
    catch(err){
        console.log(err);
    }
}

export const reportNfswImage = async (req, res) => {
    console.log(req.body, 'req.body');
    const {awsId,filesUrl,email,id,firstName} = req.body;
    try{
        reportNSFWEmail(awsId,filesUrl,email,id,firstName);
        res.status(200).json({message: 'Email sent successfully'});
    }
    catch(err){
        console.log(err);
        res.status(500).send({message:'Internal server error'});
    }
}

const reportNSFWEmail = async (awsId,filesUrl,email,id,firstName) => {
    const transporter = createTransport;
    const mailOptions = {
        from: process.env.GMAIL_AUTH_USER_SUPPORT,
        to: process.env.GMAIL_AUTH_USER_SUPPORT,
        subject: 'Report NSFW Image for Image Form',
        html: `
    <html>
    <body>
        <div>

            <img src="https://dubai-analytica.s3.ap-south-1.amazonaws.com/image/NavbarLogo.png" alt="email verification" style="display:block;margin:auto;width:50%;" />
            <p>Dubai Analytica</p>

        </div>
        <div>
            <p>Hello</p>
            <p>An admin has uploaded an image that needs to be reviewed</p>
            <br>
            <p>Uploaded By : ${email}</p>
            <p>First Name : ${firstName}</p>
            <p>UserId : ${id}</p>
            <p>Image Id in aws : ${awsId}</p>
            <p>Image Url : ${filesUrl}</p>
            <br>
            <p>Click on the link below to view the image</p>
            <p>Check the image and take necessary action</p>
        </div>
    </body>
    </html>`
    }
    try{
        const response = await transporter.sendMail(mailOptions);
    }
    catch(err){
        console.log(err);
    }
}