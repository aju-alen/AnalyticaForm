import dotenv from 'dotenv';
dotenv.config();

export const backendUrl = process.env.BACKEND_URL || "http://localhost:3001"