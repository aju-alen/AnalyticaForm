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
        user: process.env.GMAIL_AUTH_USER,
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
        from: process.env.GMAIL_AUTH_USER,
        to: process.env.GMAIL_AUTH_USER,
        subject: 'You have got a new query on Dubai Analytica',
        html: `
    <html>
    <body>
        <div>

            <img src="https://i.postimg.cc/8cpfZ5sP/215b7754-0e37-41b2-be2f-453d190af861.jpg" alt="email verification" style="display:block;margin:auto;width:50%;" />
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
      

        reportAbuseEmail(email,comment,getSurveyDetail.surveyTitle,getSurveyDetail.user.email);
        // reportAbuseEmail(username, email, message,contact);
        res.status(200).json({message: 'Email sent successfully'});
    }
    catch(err){
        console.log(err);
        res.status(500).send({message:'Internal server error'});
    }
};

const reportAbuseEmail = async (email,comment,surveyTitle,surveyOwner) => {
    const transporter = createTransport;
    const mailOptions = {
        from: process.env.GMAIL_AUTH_USER,
        to: process.env.GMAIL_AUTH_USER,
        subject: 'Report Abuse Email',
        html: `
    <html>
    <body>
        <div>

            <img src="https://i.postimg.cc/8cpfZ5sP/215b7754-0e37-41b2-be2f-453d190af861.jpg" alt="email verification" style="display:block;margin:auto;width:50%;" />
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
        from: process.env.GMAIL_AUTH_USER,
        to: process.env.GMAIL_AUTH_USER,
        subject: 'Report NSFW Image for Image Form',
        html: `
    <html>
    <body>
        <div>

            <img src="https://i.postimg.cc/8cpfZ5sP/215b7754-0e37-41b2-be2f-453d190af861.jpg" alt="email verification" style="display:block;margin:auto;width:50%;" />
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