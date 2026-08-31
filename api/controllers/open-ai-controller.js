import dotenv from 'dotenv';
import { VertexAI } from '@google-cloud/vertexai';
import { vertexContextData } from '../utils/static/static-data.js';

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
  }
  if (!generativeModel) {
    const systemInstruction = {text: vertexContextData};
    generativeModel = vertex_ai.preview.getGenerativeModel({
      model: process.env.VERTEX_AI_MODEL || 'gemini-pro',
      generationConfig: {
        maxOutputTokens: 400,
        temperature: 0.3,
        topP: 0.8,
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

let surveyBuilderModel = null;

const SURVEY_BUILDER_INSTRUCTION = `You generate survey drafts for Dubai Analytica.
Return ONLY JSON. No markdown, no commentary.
Schema:
{
  "surveyTitle": "string",
  "questions": [
    {
      "formType": "SinglePointForm|SingleCheckForm|SelectDropDownForm|CommentBoxForm|SingleRowTextForm|EmailAddressForm|StarRatingForm|SmileyRatingForm|ThumbUpDownForm|DateTimeForm|PresentationTextForm|SectionHeadingForm",
      "question": "string",
      "choices": ["string"],
      "formMandate": true
    }
  ]
}
Rules:
- Use only those formType values.
- SinglePointForm, SingleCheckForm, and SelectDropDownForm MUST include 2-8 choices.
- Other types omit choices or use [].
- At most 25 questions.
- Prefer a mix of closed and open questions matching the user's brief.
- English unless the user asks otherwise.`;

const getSurveyBuilderModel = async () => {
  if (!vertex_ai) {
    vertex_ai = await initVertexAI();
  }
  if (!surveyBuilderModel) {
    surveyBuilderModel = vertex_ai.preview.getGenerativeModel({
      model: process.env.VERTEX_AI_MODEL || 'gemini-pro',
      generationConfig: {
        maxOutputTokens: 4096,
        temperature: 0.3,
        topP: 0.9,
      },
      safetySettings: [
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
      systemInstruction: { parts: [{ text: SURVEY_BUILDER_INSTRUCTION }] },
    });
  }
  return surveyBuilderModel;
};

export const generateSurveyDraftFromPrompt = async (prompt) => {
  const model = await getSurveyBuilderModel();
  const chat = model.startChat({});
  const streamResult = await chat.sendMessageStream(prompt);
  const content = (await streamResult.response).candidates?.[0]?.content;
  const parts = content?.parts || [];
  const text = parts.map((part) => part.text || '').join('\n').trim();
  if (!text) {
    throw new Error('Empty model response');
  }
  return text;
};

const MAX_CHAT_CHARS = 2000;
const MAX_HISTORY_TURNS = 10;

function extractChunkText(chunk) {
  const parts = chunk?.candidates?.[0]?.content?.parts;
  if (!Array.isArray(parts)) return '';
  return parts.map((part) => part.text || '').join('');
}

function sanitizeChatHistory(raw) {
  if (!Array.isArray(raw)) return [];
  const cleaned = raw
    .filter((item) => item && (item.role === 'user' || item.role === 'model') && typeof item.text === 'string')
    .map((item) => ({
      role: item.role,
      parts: [{ text: String(item.text).slice(0, MAX_CHAT_CHARS) }],
    }))
    .slice(-MAX_HISTORY_TURNS);

  while (cleaned.length && cleaned[0].role !== 'user') {
    cleaned.shift();
  }

  const alternating = [];
  for (const item of cleaned) {
    if (!alternating.length || alternating[alternating.length - 1].role !== item.role) {
      alternating.push(item);
    }
  }
  return alternating;
}

export const vertexChat = async (req, res) => {
  const text = String(req.body?.message || '').trim().slice(0, MAX_CHAT_CHARS);
  if (!text) {
    return res.status(400).json({ error: true, message: 'Message is required' });
  }

  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  if (typeof res.flushHeaders === 'function') res.flushHeaders();

  const writeEvent = (payload) => {
    if (res.writableEnded) return;
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
    if (typeof res.flush === 'function') res.flush();
  };

  try {
    const model = await getGenerativeModel();
    const streamResult = await model.generateContentStream({
      contents: [
        ...sanitizeChatHistory(req.body?.history),
        { role: 'user', parts: [{ text }] },
      ],
    });

    for await (const chunk of streamResult.stream) {
      if (req.aborted || res.writableEnded) break;
      const piece = extractChunkText(chunk);
      if (piece) writeEvent({ text: piece });
    }

    writeEvent({ done: true });
    res.end();
  } catch (err) {
    console.error('Vertex AI Error:', err);
    writeEvent({
      error: true,
      message: 'Error communicating with Vertex AI',
    });
    res.end();
  }
};