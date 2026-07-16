import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import Groq from 'groq-sdk';
import { PORTFOLIO_CONTEXT } from './portfolioContext.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

let pkg = { version: '0.0.0' };
try {
  pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));
} catch {
  try { pkg = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'package.json'), 'utf-8')); }
  catch { try { pkg = JSON.parse(readFileSync('package.json', 'utf-8')); } catch {} }
}
const app = express();
const PORT = process.env.PORT || 3001;
const startTime = Date.now();
const CORS_ORIGIN = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(s => s.trim())
  : ['http://localhost:5173', 'http://localhost:4173', 'https://omganesh014.github.io'];
const API_KEY_MISSING = !process.env.GROQ_API_KEY;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://vercel.live', 'https://va.vercel-scripts.com'],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
      fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
      connectSrc: ["'self'", 'https://api.groq.com', 'https://va.vercel-analytics.com'],
      frameSrc: ["'self'", 'https://vercel.live'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
}));
app.use(morgan('short'));
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || CORS_ORIGIN.includes(origin)) cb(null, true);
    else cb(null, false);
  },
  credentials: true,
}));

app.use((_req, res, next) => {
  res.removeHeader('X-Powered-By');
  next();
});

app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const origin = req.headers['origin'];
    const referer = req.headers['referer'];
    const allowed = CORS_ORIGIN;
    if (origin && !allowed.includes(origin)) {
      return res.status(403).json({ error: 'CSRF: origin not allowed' });
    }
    if (!origin && referer) {
      try {
        const refOrigin = new URL(referer).origin;
        if (!allowed.includes(refOrigin)) {
          return res.status(403).json({ error: 'CSRF: referer not allowed' });
        }
      } catch {
        return res.status(403).json({ error: 'CSRF: invalid referer' });
      }
    }
  }
  next();
});

app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ limit: '16kb', extended: true }));
app.use(express.text({ limit: '16kb' }));
app.use(express.raw({ limit: '16kb', type: 'application/octet-stream' }));

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: { error: 'Rate limit exceeded. Please wait before sending another message.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const contactLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Too many contact submissions. Please wait before trying again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/v1/chat', chatLimiter);
app.use('/api/v1/contact', contactLimiter);

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

app.post('/api/v1/chat', async (req, res) => {
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
    console.error('POST /api/v1/chat error:', err.message);
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

app.get('/api/v1/chat', async (req, res) => {
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
    console.error('GET /api/v1/chat error:', err.message);
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

app.post('/api/v1/contact', async (req, res) => {
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

app.get('/api/v1/health', (_req, res) => {
  const mem = process.memoryUsage();
  res.json({
    status: 'ok',
    version: pkg.version,
    uptime: Math.floor((Date.now() - startTime) / 1000),
    ai: !API_KEY_MISSING,
    memory: {
      rss: Math.round(mem.rss / 1024 / 1024) + 'MB',
      heapUsed: Math.round(mem.heapUsed / 1024 / 1024) + 'MB',
      heapTotal: Math.round(mem.heapTotal / 1024 / 1024) + 'MB',
    },
    timestamp: new Date().toISOString(),
  });
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`OM Portfolio backend v${pkg.version} running on http://localhost:${PORT}`);
    if (API_KEY_MISSING) {
      console.warn('WARNING: GROQ_API_KEY is not set. AI assistant will return errors.');
      console.warn('  Get a free key at https://console.groq.com/keys and set it in backend/.env');
    }
  });
}

export default app;
