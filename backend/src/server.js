import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { randomBytes } from 'crypto';
import rateLimit from 'express-rate-limit';
import Groq from 'groq-sdk';
import { PORTFOLIO_CONTEXT } from './portfolioContext.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { validateConfig } from './config.js';

const { port, corsOrigins } = validateConfig();

const SENTRY_DSN = process.env.SENTRY_DSN;
if (SENTRY_DSN) {
  const Sentry = await import('@sentry/node');
  Sentry.init({ dsn: SENTRY_DSN, environment: process.env.NODE_ENV });
}

let pkg = { version: '0.0.0' };
try {
  pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));
} catch {
  try { pkg = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', 'package.json'), 'utf-8')); }
  catch { try { pkg = JSON.parse(readFileSync('package.json', 'utf-8')); } catch {} }
}

const app = express();
const startTime = Date.now();
const IS_PROD = process.env.NODE_ENV === 'production';

function generateNonce() {
  return randomBytes(16).toString('base64');
}

app.use((req, res, next) => {
  const nonce = generateNonce();
  res.locals.nonce = nonce;
  req.nonce = nonce;
  next();
});

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        (req, res) => `'nonce-${res.locals.nonce}'`,
        IS_PROD ? "'strict-dynamic'" : "'unsafe-eval'",
        'https://vercel.live',
      ],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
      fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
      connectSrc: ["'self'", 'https://api.groq.com', 'https://va.vercel-analytics.com'],
      frameSrc: ["'self'", 'https://vercel.live'],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: [],
      reportUri: '/api/v1/csp-report',
    },
    reportOnly: false,
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'same-origin' },
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  hsts: { maxAge: 63072000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xFrameOptions: { action: 'deny' },
  xPermittedCrossDomainPolicies: { permittedPolicies: 'none' },
}));

const permissionsPolicy = helmet.permissionsPolicy || ((req, res, next) => {
  res.setHeader('Permissions-Policy', 'accelerometer=(), ambient-light-sensor=(), autoplay=(), battery=(), camera=(), cross-origin-isolated=(), display-capture=(), document-domain=(), encrypted-media=(), execution-while-not-rendered=(), execution-while-out-of-viewport=(), fullscreen=(self), geolocation=(), gyroscope=(), hid=(), idle-detection=(), keyboard-map=(), magnetometer=(), microphone=(), midi=(), navigation-override=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), screen-wake-lock=(), serial=(), speaker-selection=(), storage-access=(), usb=(), web-share=(self), window-management=()');
  next();
});
app.use(permissionsPolicy);

app.use(morgan(IS_PROD ? 'combined' : 'short'));

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || corsOrigins.includes(origin)) cb(null, true);
    else cb(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  maxAge: 86400,
}));

app.use((_req, res, next) => {
  res.removeHeader('X-Powered-By');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
  next();
});

app.post('/api/v1/csp-report', (req, res) => {
  let body = req.body;
  if (Buffer.isBuffer(body)) {
    try { body = JSON.parse(body.toString()); } catch { body = null; }
  }
  const report = body?.['csp-report'] || body;
  if (report) {
    console.warn('CSP:', report['blocked-uri'] || 'unknown');
  }
  res.status(204).end();
});

app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const origin = req.headers['origin'];
    const referer = req.headers['referer'];
    if (origin && !corsOrigins.includes(origin)) {
      console.warn(`CSRF blocked: ${req.method} ${req.path} origin=${origin}`);
      return res.status(403).json({ error: 'Request blocked' });
    }
    if (!origin && referer) {
      try {
        const refOrigin = new URL(referer).origin;
        if (!corsOrigins.includes(refOrigin)) {
          console.warn(`CSRF blocked: ${req.method} ${req.path} referer=${refOrigin}`);
          return res.status(403).json({ error: 'Request blocked' });
        }
      } catch {
        return res.status(403).json({ error: 'Request blocked' });
      }
    }
  }
  next();
});

app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ limit: '8kb', extended: false }));
app.use(express.text({ limit: '8kb' }));
app.use(express.raw({ limit: '4kb', type: 'application/octet-stream' }));
app.use(express.raw({ limit: '8kb', type: 'application/csp-report' }));
app.use(express.raw({ limit: '8kb', type: 'application/reports+json' }));

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  message: { error: 'Too many requests' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

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

function writeSSE(res, data) {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function maskError(msg) {
  if (!msg) return 'An unexpected error occurred';
  if (msg.includes('quota') || msg.includes('Quota') || msg.includes('insufficient_quota')) {
    return 'AI service quota exceeded. Please try again later.';
  }
  if (msg.includes('timeout') || msg.includes('Timeout') || msg.includes('ETIMEDOUT')) {
    return 'AI service timed out. Please try again.';
  }
  if (msg.includes('rate_limit') || msg.includes('RateLimit') || msg.includes('rate limit')) {
    return 'AI service is currently overloaded. Please wait and try again.';
  }
  if (msg.includes('401') || msg.includes('unauthorized') || msg.includes('Unauthorized') || msg.includes('API key')) {
    return 'AI service authentication failed. Please contact the site owner.';
  }
  return 'Sorry, I encountered an error. Please try again.';
}

let groq;
function getGroq() {
  if (!groq) groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  return groq;
}

app.post('/api/v1/chat', async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required.' });
    }
    if (message.length > 2000) {
      return res.status(400).json({ error: 'Message too long.' });
    }
    if (detectInjection(message)) {
      console.warn(`Injection blocked: ${JSON.stringify(message.slice(0, 100))}`);
      return res.status(400).json({ error: 'Request blocked.' });
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Accel-Buffering': 'no',
      Connection: 'keep-alive',
    });

    const stream = await getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: PORTFOLIO_CONTEXT },
        ...history.map((m) => ({ role: m.role, content: m.parts[0].text })),
        { role: 'user', content: message },
      ],
      stream: true,
      max_tokens: 1024,
      temperature: 0.7,
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
    const msg = maskError(err.message);
    if (!res.headersSent) return res.status(500).json({ error: msg });
    writeSSE(res, { error: msg });
    res.end();
  }
});

app.get('/api/v1/chat', async (req, res) => {
  try {
    const { message } = req.query;
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required.' });
    }
    if (message.length > 2000) {
      return res.status(400).json({ error: 'Message too long.' });
    }
    if (detectInjection(message)) {
      console.warn(`Injection blocked: ${JSON.stringify(message.slice(0, 100))}`);
      return res.status(400).json({ error: 'Request blocked.' });
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'X-Accel-Buffering': 'no',
      Connection: 'keep-alive',
    });

    const stream = await getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: PORTFOLIO_CONTEXT },
        { role: 'user', content: message },
      ],
      stream: true,
      max_tokens: 1024,
      temperature: 0.7,
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
    const msg = maskError(err.message);
    if (!res.headersSent) return res.status(500).json({ error: msg });
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
    if (typeof name !== 'string' || name.length > 100) {
      return res.status(400).json({ error: 'Invalid name.' });
    }
    if (typeof email !== 'string' || email.length > 200 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Invalid email.' });
    }
    if (typeof message !== 'string' || message.length > 5000) {
      return res.status(400).json({ error: 'Message too long.' });
    }

    const sanitized = { name: name.trim(), email: email.trim().toLowerCase(), subject: (subject || '').trim(), message: message.trim() };

    if (process.env.CONTACT_EMAIL_TO) {
      const sgMail = await import('@sendgrid/mail').catch(() => null);
      if (sgMail && process.env.SENDGRID_API_KEY) {
        sgMail.default.setApiKey(process.env.SENDGRID_API_KEY);
        await sgMail.default.send({
          to: process.env.CONTACT_EMAIL_TO,
          from: process.env.CONTACT_EMAIL_FROM || process.env.CONTACT_EMAIL_TO,
          subject: `Portfolio contact: ${sanitized.subject || `Message from ${sanitized.name}`}`,
          text: `Name: ${sanitized.name}\nEmail: ${sanitized.email}\n\n${sanitized.message}`,
        });
        return res.json({ status: 'sent' });
      }
    }

    console.log('Contact:', JSON.stringify({ name: sanitized.name, email: sanitized.email }));
    res.json({ status: 'logged', message: 'Message received.' });
  } catch (err) {
    console.error('Contact error:', err.message);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

app.get('/api/v1/health', (_req, res) => {
  const mem = process.memoryUsage();
  res.json({
    status: 'ok',
    uptime: Math.floor((Date.now() - startTime) / 1000),
    ai: true,
    memory: {
      rss: Math.round(mem.rss / 1024 / 1024) + 'MB',
      heapUsed: Math.round(mem.heapUsed / 1024 / 1024) + 'MB',
    },
    timestamp: new Date().toISOString(),
  });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, _req, res, _next) => {
  console.error('Unhandled:', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`OM backend v${pkg.version} on :${port} [${process.env.NODE_ENV}]`);
  });
}

export default app;
