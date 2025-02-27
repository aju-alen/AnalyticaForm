import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';
import { VertexAI } from '@google-cloud/vertexai';
import { fileURLToPath } from 'url';

// Get the current directory (since __dirname is not available in ES6 modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Function to initialize Vertex AI with credentials
const initVertexAI = async () => {
  try {
    // Decode the base64-encoded service account key
    const serviceAccountKeyBase64 = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
    if (!serviceAccountKeyBase64) {
      throw new Error('GOOGLE_APPLICATION_CREDENTIALS_JSON is not set in environment variables.');
    }

    // Write the decoded key to a temporary file
    const serviceAccountKeyPath = path.join(__dirname, 'service-account-key.json');
    await fs.writeFile(serviceAccountKeyPath, Buffer.from(serviceAccountKeyBase64, 'base64'));

    // Initialize Vertex AI
    const vertex_ai = new VertexAI({
      project: process.env.VERTEX_AI_PROJECT_ID,
      location: process.env.VERTEX_AI_LOCATION,
      credentials: JSON.parse(await fs.readFile(serviceAccountKeyPath, 'utf8')),
    });

    // Remove temporary key file after initialization
    await fs.unlink(serviceAccountKeyPath);

    return vertex_ai;
  } catch (error) {
    console.error('Error initializing Vertex AI:', error);
    throw error;
  }
};

// Initialize Vertex AI
const vertex_ai = await initVertexAI();
const model = process.env.VERTEX_AI_MODEL;

const siText1 = { text: `Your predefined system instructions here...` };

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model,
  generationConfig: {
    maxOutputTokens: 200,
    temperature: 1,
    topP: 0.95,
  },
  safetySettings: [
    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
  ],
  systemInstruction: { parts: [siText1] },
});

const chat = generativeModel.startChat({});

// Chatbot API handler
export const vertexChat = async (req, res) => {
  const { message } = req.body;
  try {
    const streamResult = await chat.sendMessageStream(message);
    const responseContent = (await streamResult.response).candidates[0].content;
    
    res.status(200).send({ message: responseContent });
  } catch (err) {
    console.error('Vertex AI Error:', err);
    res.status(500).send({ message: 'Internal server error' });
  }
};
