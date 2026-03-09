import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();    
const resend = new Resend(process.env.RESEND_API_KEY);

const resendDRIndex = new Resend(process.env.RESEND_API_KEY_PHD_DEFENCE_READINESS);

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