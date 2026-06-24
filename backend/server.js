import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();

// 1. Enable CORS for regular incoming requests from Vite
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 2. Express 5+ Middleware: Explicitly handle browser Preflight OPTIONS handshakes
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Initialize Google Gen AI Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert AI Scheduler Agent. Your task is to process a user's task input.
You must always reply using the specified JSON schema.
Rules:
1. Identify if the user provided BOTH an 'urgency' level (High/Medium/Low) and an 'importance' level (High/Medium/Low).
2. If either metric is missing, set 'needs_clarification' to true, and write an 'ai_reply' asking for the missing metric gracefully.
3. If both metrics are present (or can be completely deduced from context), set 'needs_clarification' to false, extract the task details, and provide a confirming 'ai_reply'.
`;

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    needs_clarification: { type: Type.BOOLEAN },
    ai_reply: { type: Type.STRING },
    task_extracted: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        urgency: { type: Type.STRING },
        importance: { type: Type.STRING }
      },
      required: ["title", "urgency", "importance"]
    }
  },
  required: ["needs_clarification", "ai_reply"]
};

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    const formattedHistory = history.map(chat => ({
      role: chat.role,
      parts: [{ text: chat.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [...formattedHistory, { role: 'user', parts: [{ text: message }] }],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      }
    });

    const result = JSON.parse(response.text);
    res.json(result);

  } catch (error) {
    console.error("Backend Error:", error);
    res.status(500).json({ error: "Agent connection failed." });
  }
});

// SHIFTED TO PORT 5001 TO AVOID MACOS AIRPLAY CONFLICTS
// Change this line from: const PORT = process.env.PORT || 5001;
// To this exact hardcoded assignment:
const PORT = 5001; 

app.listen(PORT, () => console.log(`🚀 AI Agent Server executing on port ${PORT}`));