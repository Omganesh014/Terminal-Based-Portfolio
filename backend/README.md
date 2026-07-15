# OM Portfolio — Backend

Express proxy server for the OM portfolio AI assistant. Handles Gemini API calls, rate limiting, and prompt-injection detection.

## Setup

1. Copy `.env.example` to `.env` and set your Gemini API key:

```bash
cp .env.example .env
# Edit .env and set GEMINI_API_KEY=your_key_here
```

Get a free API key at https://aistudio.google.com/apikey

2. Install and start:

```bash
npm install
npm run dev
```

The server starts on `http://localhost:3001`.

## Endpoints

| Method | Path | Description |
|---|---|---|
| POST | `/api/chat` | Send a message to the AI assistant |
| GET | `/api/health` | Health check (returns `{ status, ai: bool }`) |

### POST /api/chat

Request body:
```json
{
  "message": "What projects has Om built?",
  "history": []
}
```

Rate limited to 10 requests per minute per IP. Messages over 2000 characters are rejected. Prompt-injection patterns are detected and blocked.

## Environment variables

| Variable | Default | Description |
|---|---|---|
| `GEMINI_API_KEY` | — | Gemini API key (required) |
| `PORT` | `3001` | Server port |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed CORS origin |

## Tech stack

Express, `@google/generative-ai`, `express-rate-limit`, CORS, dotenv.