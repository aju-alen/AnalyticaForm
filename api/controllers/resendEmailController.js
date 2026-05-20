import { resendEmailContactUs } from '../utils/resendEmailTemplate.js';
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