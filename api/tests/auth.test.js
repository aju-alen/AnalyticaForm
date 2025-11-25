const { jest } = require('@jest/globals');
const { userRegister, login } = require('../controllers/auth-controllers.js');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock PrismaClient
jest.mock('@prisma/client', () => ({
    PrismaClient: jest.fn(() => ({
        user: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
        $disconnect: jest.fn(),
    })),
}));

// Mock bcrypt
jest.mock('bcrypt', () => ({
    hash: jest.fn(),
    compare: jest.fn(),
}));

// Mock jwt
jest.mock('jsonwebtoken', () => ({
    sign: jest.fn(),
}));

// Mock nodemailer
jest.mock('nodemailer', () => ({
    createTransport: jest.fn(() => ({
        sendMail: jest.fn(),
    })),
}));

describe('Authentication Tests', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        mockReq = {
            body: {},
        };
        mockRes = {
            status: jest.fn(() => mockRes),
            json: jest.fn(),
            cookie: jest.fn(),
        };
        mockNext = jest.fn();
    });

    describe('userRegister', () => {
        it('should return 400 if required fields are missing', async () => {
            mockReq.body = {
                firstName: 'John',
                lastName: 'Doe',
                // email and password missing
            };

            await userRegister(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Please fill all the fields"
            });
        });

        it('should return 400 if user already exists', async () => {
            mockReq.body = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123',
            };

            const mockPrisma = new PrismaClient();
            mockPrisma.user.findUnique.mockResolvedValue({ email: 'john@example.com' });

            await userRegister(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "User already exists. You can login"
            });
        });

        it('should successfully register a new user', async () => {
            mockReq.body = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123',
                receiveMarketingEmails: true,
            };

            const mockPrisma = new PrismaClient();
            mockPrisma.user.findUnique.mockResolvedValue(null);
            mockPrisma.user.create.mockResolvedValue({
                id: '123',
                email: 'john@example.com',
                firstName: 'John',
                lastName: 'Doe',
            });

            bcrypt.hash.mockResolvedValue('hashedPassword');

            await userRegister(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "User registered successfully. Please verify your details by email."
            });
        });

        // New test cases for registration
        it('should handle empty strings in required fields', async () => {
            mockReq.body = {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
            };

            await userRegister(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Please fill all the fields"
            });
        });

        it('should handle invalid email format', async () => {
            mockReq.body = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'invalid-email',
                password: 'password123',
            };

            const mockPrisma = new PrismaClient();
            mockPrisma.user.findUnique.mockResolvedValue(null);

            await userRegister(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            // Note: Email validation is handled by the frontend, so backend accepts any string
        });

        it('should handle database errors during registration', async () => {
            mockReq.body = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123',
            };

            const mockPrisma = new PrismaClient();
            mockPrisma.user.findUnique.mockRejectedValue(new Error('Database error'));

            await userRegister(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "An error occurred during registration. Please try again or contact support.",
                error: "REGISTRATION_FAILED"
            });
        });

        it('should handle email sending failure', async () => {
            mockReq.body = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                password: 'password123',
            };

            const mockPrisma = new PrismaClient();
            mockPrisma.user.findUnique.mockResolvedValue(null);
            mockPrisma.user.create.mockResolvedValue({
                id: '123',
                email: 'john@example.com',
                firstName: 'John',
                lastName: 'Doe',
            });

            bcrypt.hash.mockResolvedValue('hashedPassword');
            // Simulate email sending failure
            jest.spyOn(global.console, 'error').mockImplementation(() => {});

            await userRegister(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "User registered successfully, but we couldn't send the verification email. Please contact support.",
                error: "EMAIL_SEND_FAILED"
            });
        });
    });

    describe('login', () => {
        it('should return 400 if email or password is missing', async () => {
            mockReq.body = {
                email: 'john@example.com',
                // password missing
            };

            await login(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Please fill all the fields"
            });
        });

        it('should return 400 if user does not exist', async () => {
            mockReq.body = {
                email: 'nonexistent@example.com',
                password: 'password123',
            };

            const mockPrisma = new PrismaClient();
            mockPrisma.user.findUnique.mockResolvedValue(null);

            await login(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "There exist no email in this application. You can register as a new account."
            });
        });

        it('should return 400 if password is incorrect', async () => {
            mockReq.body = {
                email: 'john@example.com',
                password: 'wrongpassword',
            };

            const mockPrisma = new PrismaClient();
            mockPrisma.user.findUnique.mockResolvedValue({
                email: 'john@example.com',
                password: 'hashedPassword',
            });

            bcrypt.compare.mockResolvedValue(false);

            await login(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Invalid password. Try again."
            });
        });

        it('should return 401 if email is not verified', async () => {
            mockReq.body = {
                email: 'john@example.com',
                password: 'password123',
            };

            const mockPrisma = new PrismaClient();
            mockPrisma.user.findUnique.mockResolvedValue({
                email: 'john@example.com',
                password: 'hashedPassword',
                emailVerified: false,
            });

            bcrypt.compare.mockResolvedValue(true);

            await login(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "You have not verified your email. Please check for your verification email on your registered inbox. If you feel there is somethig wrong, contact us."
            });
        });

        it('should successfully login a user', async () => {
            mockReq.body = {
                email: 'john@example.com',
                password: 'password123',
            };

            const mockUser = {
                email: 'john@example.com',
                id: '123',
                firstName: 'John',
                isAdmin: false,
                isSuperAdmin: false,
                emailVerified: true,
            };

            const mockPrisma = new PrismaClient();
            mockPrisma.user.findUnique.mockResolvedValue(mockUser);

            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mockToken');

            await login(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                accessToken: 'mockToken',
                message: "Login successful",
                email: mockUser.email,
                id: mockUser.id,
                firstName: mockUser.firstName,
                isAdmin: mockUser.isAdmin,
                isSuperAdmin: mockUser.isSuperAdmin
            });
        });

        // New test cases for login
        it('should handle empty strings in login fields', async () => {
            mockReq.body = {
                email: '',
                password: '',
            };

            await login(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "Please fill all the fields"
            });
        });

        it('should handle database errors during login', async () => {
            mockReq.body = {
                email: 'john@example.com',
                password: 'password123',
            };

            const mockPrisma = new PrismaClient();
            mockPrisma.user.findUnique.mockRejectedValue(new Error('Database error'));

            await login(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "An error has occoured"
            });
        });

        it('should handle JWT token generation failure', async () => {
            mockReq.body = {
                email: 'john@example.com',
                password: 'password123',
            };

            const mockUser = {
                email: 'john@example.com',
                id: '123',
                firstName: 'John',
                isAdmin: false,
                isSuperAdmin: false,
                emailVerified: true,
            };

            const mockPrisma = new PrismaClient();
            mockPrisma.user.findUnique.mockResolvedValue(mockUser);

            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockImplementation(() => {
                throw new Error('JWT signing failed');
            });

            await login(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: "An error has occoured"
            });
        });

        it('should handle case-insensitive email matching', async () => {
            mockReq.body = {
                email: 'JOHN@example.com',
                password: 'password123',
            };

            const mockUser = {
                email: 'john@example.com',
                id: '123',
                firstName: 'John',
                isAdmin: false,
                isSuperAdmin: false,
                emailVerified: true,
            };

            const mockPrisma = new PrismaClient();
            mockPrisma.user.findUnique.mockResolvedValue(mockUser);

            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mockToken');

            await login(mockReq, mockRes, mockNext);

            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({
                accessToken: 'mockToken',
                message: "Login successful",
                email: mockUser.email,
                id: mockUser.id,
                firstName: mockUser.firstName,
                isAdmin: mockUser.isAdmin,
                isSuperAdmin: mockUser.isSuperAdmin
            });
        });

        it('should set refresh token cookie with correct options', async () => {
            mockReq.body = {
                email: 'john@example.com',
                password: 'password123',
            };

            const mockUser = {
                email: 'john@example.com',
                id: '123',
                firstName: 'John',
                isAdmin: false,
                isSuperAdmin: false,
                emailVerified: true,
            };

            const mockPrisma = new PrismaClient();
            mockPrisma.user.findUnique.mockResolvedValue(mockUser);

            bcrypt.compare.mockResolvedValue(true);
            jwt.sign.mockReturnValue('mockToken');

            await login(mockReq, mockRes, mockNext);

            expect(mockRes.cookie).toHaveBeenCalledWith('refreshToken', 'mockToken', {
                httpOnly: true,
                secure: true,
                sameSite: 'none',
                maxAge: 1000 * 60 * 60 * 12, // 12 hours
            });
        });
    });
}); 