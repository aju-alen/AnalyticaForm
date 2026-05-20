import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();    
const resend = new Resend(process.env.RESEND_API_KEY);

const resendDRIndex = new Resend(process.env.RESEND_API_KEY_PHD_DEFENCE_READINESS);

const mtcResend = new Resend(process.env.RESEND_API_KEY_MTC);

export const resendEmailContactUs = async (name, email, message) => {
    try {
        const html = resendEmailContactUsTemplate(name, email, message);
        const emailData = {
            from: process.env.MTC_EMAIL_ID,
            to: process.env.MTC_EMAIL_ID,
            subject: 'Contact Us',
            html: html,
        };
        const response = await mtcResend.emails.send(emailData);
        return response;
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

export const resendEmailDRIndex = async (senderEmail, recipientEmail, subject, html, attachments = []) => {
    try {
        const fromAddress = senderEmail?.includes('<') ? senderEmail : `Defence Readiness Index <${senderEmail}>`;
        const emailData = {
            from: fromAddress,
            to: recipientEmail,
            subject: subject,
            html: html,
        };
        
        if (attachments && attachments.length > 0) {
            emailData.attachments = attachments;
        }
        
        const response = await resendDRIndex.emails.send(emailData);
        return response;
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

export const resendEmailContactUsTemplate = (name, email, message) => {
    return `<html>
            <body>
                <p>Hello Admin,</p>
                <p>You have received a new query on Dubai Analytica</p>
                <br>
                <p>Name: ${name}</p>
                <p>Email: ${email}</p>
                <p>Message: ${message}</p>
            </body>
            </html>`;
}