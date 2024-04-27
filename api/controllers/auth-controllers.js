import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();


export const userRegister = async (req, res, next) => {
    const { firstName, lastName, email, password, receiveMarketingEmails } = req.body;

    try {

        // Check if all fields are filled
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }
        const userExists = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (userExists) {
            return res.status(400).json({ message: "User already exists. You can login" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const lowercaseEmail = email.toLowerCase();
        const user = await prisma.user.create({
            data: {
                email: lowercaseEmail,
                password: hashedPassword,
                firstName,
                lastName,
                receiveMarketingEmails,
            }
        });
        await prisma.$disconnect();
        if (!user) {
            return res.status(400).json({ message: "User registration failed. please try again" });
        }

        res.status(201).json({ message: "User registered successfully" });


    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error has occoured" });
    }
};

export const login = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill all the fields" });
        }

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        });
        await prisma.$disconnect();
        if (!user) {
            return res.status(400).json({ message: "There exist no email in this application. You can register as a new account." });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Invalid password. Try again." });
        }

        const accessToken = jwt.sign({ email: user.email, id: user.id, isAdmin: user.isAdmin, firstName: user.firstName },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' });

        const refreshToken = jwt.sign({ email: user.email, id: user.id, isAdmin: user.isAdmin, firstName: user.firstName },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '12h' }
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true, //cookie cannot be accessed by client side
            secure: true, //https
            sameSite: 'none', //different domain can access
            maxAge: 1000 * 60 * 60 * 12, //12 hrs
        });

        res.status(200).json({ accessToken, message: "Login successful", email: user.email, id: user.id, firstName: user.firstName, isAdmin: user.isAdmin });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error has occoured" });
    }
};

export const refresh = async (req, res, next) => {

    const cookies = req.cookies;

    if (!cookies.refreshToken) {
        return res.status(401).json({ message: "You are not authenticated" });
    }

    const refreshToken = cookies.refreshToken;

    jwt.verify(refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid token" });
            }
            const foundUser = prisma.user.findUnique({
                where: {
                    email: decoded.email
                }
            });
            if (!foundUser) {
                return res.status(401).json({ message: "Unauthorized User" });
            }

            const accessToken = jwt.sign(
                {
                    email: foundUser.email,
                    id: foundUser.id,
                    isAdmin: foundUser.isAdmin,
                    firstName: foundUser.firstName
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '1h' }
            )
            res.json({ accessToken });
        });

}

export const logout = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        if (!cookies.refreshToken) {
            return res.status(204)
        }
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        })
        res.json({ message: "Logout successful, Cookie has been cleared" })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "An error has occoured" })

    }
}

//just for testing purpose of the middleware
export const test = async (req, res, next) => {

    res.json({ message: "Test successful" });
}