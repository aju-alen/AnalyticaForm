import dotenv from 'dotenv';
import { VertexAI } from '@google-cloud/vertexai';
import { vertexContextData } from '../utils/vertexContextData.js';

dotenv.config();

// Function to initialize Vertex AI with credentials
const initVertexAI = async () => {
  try { 

    if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
      console.log('this is the if');
      try {
        
        // Decode the base64 encoded credentials
        const decodedCredentials = Buffer.from(
          process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON, 
          'base64'
        ).toString();
        
        const credentials = JSON.parse(decodedCredentials);
        
        const vertex_ai = new VertexAI({
          project: process.env.VERTEX_AI_PROJECT_ID || credentials.project_id,
          location: process.env.VERTEX_AI_LOCATION || 'us-central1',
          googleAuthOptions: {
            credentials: credentials
          }
        });
        
        return vertex_ai;
      } catch (parseError) {
        console.error('Error parsing credentials:', parseError);
        throw new Error('Failed to parse service account credentials.');
      }
    } else {
      console.log('this is the else');
      
      // Default case: Let Google Auth library find credentials automatically
      // This works when GOOGLE_APPLICATION_CREDENTIALS environment variable points to your JSON key file
      const vertex_ai = new VertexAI({
        project: process.env.VERTEX_AI_PROJECT_ID,
        location: process.env.VERTEX_AI_LOCATION || 'us-central1'
      });
      
      return vertex_ai;
    }
  } catch (error) {
    console.error('Error initializing Vertex AI:', error);
    throw error;
  }
};

// Initialize Vertex AI lazily
let vertex_ai = null;
let generativeModel = null;

// Function to get or initialize Vertex AI and model
const getGenerativeModel = async () => {
  if (!vertex_ai) {
    vertex_ai = await initVertexAI();
    
    // Create a more appropriate system instruction
    const systemInstruction = {text: vertexContextData};
    
    generativeModel = vertex_ai.preview.getGenerativeModel({
      model: process.env.VERTEX_AI_MODEL || 'gemini-pro',
      generationConfig: {
        maxOutputTokens: 500,  // Increased for more complete responses
        temperature: 0.7,       // Adjusted for balanced creativity/consistency
        topP: 0.95,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
      systemInstruction: { parts: [systemInstruction] },
    });
  }
  return generativeModel;
};

// Modified chatbot API handler
export const vertexChat = async (req, res) => {
  const { message } = req.body;
  try {
    const model = await getGenerativeModel();
    const chat = model.startChat({});
    const streamResult = await chat.sendMessageStream(message);
    const responseContent = (await streamResult.response).candidates[0].content;

    res.status(200).send({ message: responseContent });
  } catch (err) {
    console.error('Vertex AI Error:', err);
    res.status(500).send({ 
      error: true,
      message: 'Error communicating with Vertex AI',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};