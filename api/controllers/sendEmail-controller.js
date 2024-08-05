import nodemailer from "nodemailer";
import { PrismaClient } from '@prisma/client'

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
    console.log(process.env.GMAIL_AUTH_USER);
    console.log(process.env.GMAIL_AUTH_PASS);

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