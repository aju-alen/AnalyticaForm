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
            from: process.env.RESEND_EMAILID_MTC,
            to: process.env.RESEND_EMAILID_MTC,
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
};

const escapeHtml = (str) => {
    if (str === undefined || str === null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
};

export const resendEmailMembershipEnquiryTemplate = (payload) => {
    const e = escapeHtml;
    const {
        fullName,
        email,
        phone,
        address,
        membershipType,
        proposerName,
        proposerContact,
        seconderName,
        seconderContact,
        declaration,
    } = payload;
    return `<html>
            <body>
                <p>Hello Admin,</p>
                <p>You have received a new membership enquiry.</p>
                <br>
                <p><strong>Full name:</strong> ${e(fullName)}</p>
                <p><strong>Email:</strong> ${e(email)}</p>
                <p><strong>Phone:</strong> ${e(phone)}</p>
                <p><strong>Address:</strong> ${e(address)}</p>
                <p><strong>Membership type:</strong> ${e(membershipType)}</p>
                <p><strong>Proposer name:</strong> ${e(proposerName)}</p>
                <p><strong>Proposer contact:</strong> ${e(proposerContact)}</p>
                <p><strong>Seconder name:</strong> ${e(seconderName)}</p>
                <p><strong>Seconder contact:</strong> ${e(seconderContact)}</p>
                <p><strong>Declaration:</strong> ${e(declaration)}</p>
            </body>
            </html>`;
};

export const resendEmailMembershipEnquiry = async (payload) => {
    try {
        const html = resendEmailMembershipEnquiryTemplate(payload);
        const emailData = {
            from: process.env.RESEND_EMAILID_MTC,
            to: process.env.RESEND_EMAILID_MTC,
            subject: 'Membership Enquiry',
            html,
        };
        const response = await mtcResend.emails.send(emailData);
        return response;
    } catch (error) {
        console.error('Error sending membership enquiry email:', error);
        throw error;
    }
};