import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PORTFOLIO_CONTEXT } from './portfolioContext.js';

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: '2kb' }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Rate limit exceeded. Please wait before sending another message.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/chat', limiter);

const INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|directions|prompts?)/i,
  /you\s+are\s+(now|not\s+(required\s+to|bound\s+by|limited\s+to))/i,
  /system\s+prompt/i,
  /override\s+(your\s+)?(instructions|constraints|guidelines)/i,
  /act\s+as\s+(if\s+you\s+are|though\s+you\s+are)?\s+(a?\s*)?(free|unrestricted|unbounded|general|chat)?\s*(gpt|ai|assistant)/i,
  /disregard\s+(all\s+)?(previous|prior|above|your)/i,
  /you\s+(don't|do\s+not)\s+(have\s+to|need\s+to)\s+(follow|obey|adhere)/i,
];

function detectInjection(text) {
  return INJECTION_PATTERNS.some((pattern) => pattern.test(text));
}

function trimConversation(messages, maxLen = 8000) {
  let total = 0;
  for (let i = messages.length - 1; i >= 0; i--) {
    total += messages[i].parts[0].text.length;
    if (total > maxLen) return messages.slice(i + 1);
  }
  return messages;
}

let genAI;
function getGenAI() {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required.' });
    }
    if (message.length > 2000) {
      return res.status(400).json({ error: 'Message too long (max 2000 characters).' });
    }
    if (detectInjection(message)) {
      return res.status(400).json({ error: 'I can only answer questions about OmGanesh\'s portfolio and background. Please ask me something relevant.' });
    }

    const model = getGenAI().getGenerativeModel({ model: 'gemini-2.0-flash' });

    const contents = [
      { role: 'user', parts: [{ text: PORTFOLIO_CONTEXT }] },
      { role: 'model', parts: [{ text: 'Understood. I am OM AI, scoped to this portfolio. I will only answer portfolio-related questions.' }] },
      ...trimConversation(history),
      { role: 'user', parts: [{ text: message }] },
    ];

    const result = await model.generateContent({ contents });
    const response = result.response.text();

    res.json({ response });
  } catch (err) {
    console.error('Gemini API error:', err.message);
    if (err.message?.includes('API_KEY')) {
      return res.status(500).json({ error: 'AI service is not configured. Please set up the GEMINI_API_KEY.' });
    }
    res.status(500).json({ error: 'Sorry, I encountered an error. Please try again.' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', ai: !!process.env.GEMINI_API_KEY });
});

app.listen(PORT, () => {
  console.log(`OM Portfolio backend running on http://localhost:${PORT}`);
  if (!process.env.GEMINI_API_KEY) {
    console.warn('WARNING: GEMINI_API_KEY is not set. AI assistant will return errors.');
  }
});
