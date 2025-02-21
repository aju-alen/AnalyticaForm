import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

const createTransport = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.GMAIL_AUTH_USER_SUPPORT,
        pass: process.env.GMAIL_AUTH_PASS
    }
})

const sendEmail = async ({senderEmailId, receiverEmailId, subject, htmlString}) => {
    const transporter = createTransport;
    console.log(transporter, 'transporter');
    const mailOptions = {
        from: senderEmailId,
        to: receiverEmailId ,
        subject: subject,
        html: htmlString
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

export default sendEmail;