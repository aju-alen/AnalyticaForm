import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();    
const resend = new Resend(process.env.RESEND_API_KEY);



export const resendEmailBoiler = async (senderEmail, recipientEmail, subject, html, attachments = []) => {
    try {
        const emailData = {
            from: senderEmail,
            to: recipientEmail,
            subject: subject,
            html: html,
        };
        
        if (attachments && attachments.length > 0) {
            emailData.attachments = attachments;
        }
        
        const response = await resend.emails.send(emailData);
        return response;
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}