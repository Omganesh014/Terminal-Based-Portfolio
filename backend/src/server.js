import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import Groq from 'groq-sdk';
import { PORTFOLIO_CONTEXT } from './portfolioContext.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
  : ['http://localhost:5173', 'http://localhost:4173', 'https://omganesh014.github.io'];
const API_KEY_MISSING = !process.env.GROQ_API_KEY;

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || CORS_ORIGIN.includes(origin)) cb(null, true);
    else cb(null, false);
  },
}));
app.use(express.json({ limit: '50kb' }));

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

function writeSSE(res, data) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function apiKeyError(res) {
  return res.status(500).json({
    error: 'AI service is not configured. Set GROQ_API_KEY in backend/.env (get a free key at https://console.groq.com/keys).',
  });
}

let groq;
function getGroq() {
  if (!groq) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
}

app.post('/api/chat', async (req, res) => {
  try {
    if (API_KEY_MISSING) return apiKeyError(res);

    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required.' });
    }
    if (message.length > 2000) {
      return res.status(400).json({ error: 'Message too long (max 2000 characters).' });
    }
    if (detectInjection(message)) {
      return res.status(400).json({ error: 'I can only answer about OmGanesh\'s portfolio.' });
    }

    const messages = [
      { role: 'system', content: PORTFOLIO_CONTEXT },
      ...history.map((m) => ({ role: m.role, content: m.parts[0].text })),
      { role: 'user', content: message },
    ];

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    const stream = await getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      stream: true,
    });

    let fullText = '';
    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || '';
      if (text) {
        fullText += text;
        writeSSE(res, { text });
      }
    }

    writeSSE(res, { done: true, fullText });
    res.end();
  } catch (err) {
    console.error('POST /api/chat error:', err.message);
    const msg = err.message?.includes('quota') || err.message?.includes('Quota')
      ? 'AI API quota exceeded for today. Please try again later or use a different API key.'
      : 'Sorry, I encountered an error. Please try again.';
    if (!res.headersSent) {
      return res.status(500).json({ error: msg });
    }
    writeSSE(res, { error: msg });
    res.end();
  }
});

app.get('/api/chat', async (req, res) => {
  try {
    if (API_KEY_MISSING) return apiKeyError(res);

    const { message } = req.query;
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required.' });
    }
    if (message.length > 2000) {
      return res.status(400).json({ error: 'Message too long (max 2000 characters).' });
    }
    if (detectInjection(message)) {
      return res.status(400).json({ error: 'I can only answer about OmGanesh\'s portfolio.' });
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });

    const stream = await getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: PORTFOLIO_CONTEXT },
        { role: 'user', content: message },
      ],
      stream: true,
    });

    let fullText = '';
    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || '';
      if (text) {
        fullText += text;
        writeSSE(res, { text });
      }
    }
    writeSSE(res, { done: true, fullText });
    res.end();
  } catch (err) {
    console.error('GET /api/chat error:', err.message);
    const msg = err.message?.includes('quota') || err.message?.includes('Quota')
      ? 'AI API quota exceeded for today. Please try again later or use a different API key.'
      : 'Sorry, I encountered an error. Please try again.';
    if (!res.headersSent) {
      return res.status(500).json({ error: msg });
    }
    writeSSE(res, { error: msg });
    res.end();
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }
    if (name.length > 100 || email.length > 200 || message.length > 5000) {
      return res.status(400).json({ error: 'One or more fields exceed the maximum length.' });
    }

    if (process.env.CONTACT_EMAIL_TO) {
      const sgMail = await import('@sendgrid/mail').catch(() => null);
      if (sgMail && process.env.SENDGRID_API_KEY) {
        sgMail.default.setApiKey(process.env.SENDGRID_API_KEY);
        await sgMail.default.send({
          to: process.env.CONTACT_EMAIL_TO,
          from: process.env.CONTACT_EMAIL_FROM || process.env.CONTACT_EMAIL_TO,
          subject: `Portfolio contact: ${subject || `Message from ${name}`}`,
          text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        });
        return res.json({ status: 'sent' });
      }
    }

    console.log('Contact form submission:', { name, email, subject, message });
    res.json({ status: 'logged', message: 'Message received. I\'ll get back to you soon.' });
  } catch (err) {
    console.error('Contact form error:', err.message);
    res.status(500).json({ error: 'Failed to send message. Please try again later.' });
  }
});

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', ai: !API_KEY_MISSING });
});

if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
  const staticPath = join(__dirname, '..', '..', 'frontend', 'dist');
  app.use(express.static(staticPath));
  app.get('*', (_req, res) => {
    res.sendFile(join(staticPath, 'index.html'));
  });
}

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`OM Portfolio backend running on http://localhost:${PORT}`);
    if (API_KEY_MISSING) {
      console.warn('WARNING: GROQ_API_KEY is not set. AI assistant will return errors.');
      console.warn('  Get a free key at https://console.groq.com/keys and set it in backend/.env');
    }
  });
}

export default app;
