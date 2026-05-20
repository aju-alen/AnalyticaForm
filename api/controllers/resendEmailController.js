import { resendEmailContactUs, resendEmailMembershipEnquiry } from '../utils/resendEmailTemplate.js';
export const ContactUs = async (req, res) => {
    try {
        const { name, email, message} = req.body;
        const emailResponse = await resendEmailContactUs(name, email, message);
        res.status(200).json({ message: 'Email sent successfully', emailResponse });
    }
    catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
   
}

const membershipEnquiryRequiredFields = [
    'fullName',
    'email',
    'phone',
    'address',
    'membershipType',
    'proposerName',
    'proposerContact',
    'seconderName',
    'seconderContact',
    'declaration',
];

export const MembershipEnquiry = async (req, res) => {
    try {
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
        } = req.body;

        const missing = membershipEnquiryRequiredFields.filter((key) => {
            const value = req.body?.[key];
            if (value === undefined || value === null) return true;
            if (key === 'declaration') {
                if (typeof value === 'boolean') return !value;
                if (typeof value === 'string') return value.trim() === '';
                return true;
            }
            if (typeof value === 'string' && value.trim() === '') return true;
            return false;
        });

        if (missing.length > 0) {
            return res.status(400).json({
                message: 'Missing required fields',
                missing,
            });
        }

        const emailResponse = await resendEmailMembershipEnquiry({
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
        });
        res.status(200).json({ message: 'Email sent successfully', emailResponse });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};