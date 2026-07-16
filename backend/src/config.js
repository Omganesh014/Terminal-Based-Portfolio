const REQUIRED = ['GROQ_API_KEY'];
const OPTIONAL = {
  PORT: { default: 3001, type: 'number' },
  CORS_ORIGIN: { default: 'http://localhost:5173,http://localhost:4173' },
  SENTRY_DSN: { default: '' },
  NODE_ENV: { default: 'development' },
};

export function validateConfig() {
  const missing = REQUIRED.filter((key) => !process.env[key]);
  if (missing.length) {
    console.error(`FATAL: Missing required environment variables: ${missing.join(', ')}`);
    console.error(`  Set them in backend/.env or in your environment.`);
    process.exit(1);
  }

  for (const [key, opts] of Object.entries(OPTIONAL)) {
    if (!process.env[key] && opts.default !== undefined) {
      process.env[key] = String(opts.default);
    }
  }

  const port = parseInt(process.env.PORT, 10);
  if (isNaN(port) || port < 1024 || port > 65535) {
    console.error(`FATAL: PORT must be between 1024 and 65535, got ${process.env.PORT}`);
    process.exit(1);
  }

  const corsOrigins = process.env.CORS_ORIGIN.split(',').map((s) => s.trim());
  for (const origin of corsOrigins) {
    try { new URL(origin); }
    catch {
      console.error(`FATAL: Invalid CORS_ORIGIN URL: ${origin}`);
      process.exit(1);
    }
  }

  return { port, corsOrigins };
}
