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
                <p>You have received a new query on MTCM Foundation</p>
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

export const resendEmailResourcesRequest = async (name, email, documentType, message) => {
    try {
        const html = resendEmailResourcesRequestTemplate(name, email, documentType, message);
        const emailData = {
            from: process.env.RESEND_EMAILID_MTC,
            to: process.env.RESEND_EMAILID_MTC,
            subject: 'Resources Request',
            html: html,
        };
        const response = await mtcResend.emails.send(emailData);
        return response;
    } catch (error) {
        console.error('Error sending resources request email:', error);
        throw error;
    }
}

export const resendEmailResourcesRequestTemplate = (name, email, documentType, message) => {
    return `<html>
            <body>
                <p>Hello Admin,</p>
                <p>You have received a new resources request.</p>
                <br>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Document type:</strong> ${documentType}</p>
                <p><strong>Message:</strong> ${message}</p>
            </body>
            </html>`;
}

export const resendEmailPhdSuccessConsultationFormTemplate = (payload) => {
    const e = escapeHtml;
    const {
        fullName,
        email,
        phone,
        university,
        dissertationStage,
        needsDescription,
        consultationMethod,
        budget,
        urgency,
        importance,
        additionalComments,
    } = payload;

    return `<html>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; color: #1f2937; line-height: 1.5;">
                <div style="border-bottom: 3px solid #c62828; padding-bottom: 12px; margin-bottom: 20px;">
                    <h2 style="margin: 0; color: #c62828; font-weight: 600;">PhD Success Consultation</h2>
                    <p style="margin: 8px 0 0; color: #6b7280; font-size: 14px;">New consultation request</p>
                </div>
                <p>Hello Admin,</p>
                <p>You have received a new PhD Success consultation form submission.</p>
                <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                    <tr><td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Full Name</td><td style="padding: 8px 0;">${e(fullName)}</td></tr>
                    <tr><td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Email</td><td style="padding: 8px 0;"><a href="mailto:${e(email)}">${e(email)}</a></td></tr>
                    <tr><td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Phone Number</td><td style="padding: 8px 0;">${e(phone)}</td></tr>
                    <tr><td style="padding: 8px 0; font-weight: 600; vertical-align: top;">University/Institution</td><td style="padding: 8px 0;">${e(university)}</td></tr>
                    <tr><td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Current Stage of Dissertation</td><td style="padding: 8px 0;">${e(dissertationStage)}</td></tr>
                    <tr><td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Preferred Method of Consultation</td><td style="padding: 8px 0;">${e(consultationMethod)}</td></tr>
                    <tr><td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Budget</td><td style="padding: 8px 0;">${e(budget)}</td></tr>
                    <tr><td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Range of Urgency</td><td style="padding: 8px 0;">${e(urgency)}</td></tr>
                    <tr><td style="padding: 8px 0; font-weight: 600; vertical-align: top;">Range of Importance</td><td style="padding: 8px 0;">${e(importance)}</td></tr>
                </table>
                <p style="margin-top: 20px; font-weight: 600;">Brief Description of Needs/Challenges</p>
                <p style="white-space: pre-wrap; background: #f9fafb; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb;">${e(needsDescription)}</p>
                <p style="margin-top: 16px; font-weight: 600;">Additional Comments</p>
                <p style="white-space: pre-wrap; background: #f9fafb; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb;">${e(additionalComments || '(none)')}</p>
            </body>
            </html>`;
};

export const resendEmailPhdSuccessConsultationForm = async (payload) => {
    try {
        const html = resendEmailPhdSuccessConsultationFormTemplate(payload);
        const fromAddress = process.env.RESEND_EMAILID_PHD_CONSULTATION_FORM || '';
        const emailData = {
            from: fromAddress.includes('<') ? fromAddress : `PhD Success <${fromAddress}>`,
            to: 'michael.literati@gmail.com',
            reply_to: payload.email,
            subject: `PhD Success Consultation – ${payload.fullName}`,
            html,
        };
        const response = await resendDRIndex.emails.send(emailData);
        return response;
    } catch (error) {
        console.error('Error sending PhD Success consultation email:', error);
        throw error;
    }
};