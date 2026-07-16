# OM — Terminal-Based Developer Portfolio

An interactive, terminal-themed developer portfolio built with React, TypeScript, and Express. Navigate projects, skills, and experience through a command-line interface that simulates a desktop OS experience.

[![CI](https://github.com/omganesh014/Terminal-Based-Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/omganesh014/Terminal-Based-Portfolio/actions/workflows/ci.yml)

## Features

- **Terminal Interface**: Boot, login, and desktop simulation with a virtual filesystem
- **AI Assistant**: Ask questions about OmGanesh's portfolio via Groq API (with local Fuse.js fallback)
- **Virtual Filesystem**: `ls`, `cd`, `cat`, `tree`, `find`, `grep`, and more
- **Mini Games**: Snake and Tic-Tac-Toe playable from the terminal
- **Theme System**: Midnight, Ember, Aurora, and Neon themes
- **PWA**: Service worker with offline support via `vite-plugin-pwa`
- **Responsive**: Desktop and mobile layouts with resizable windows

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Frontend (Vite + React)        │
│  ┌─────────┐ ┌──────────┐ ┌──────────────────┐ │
│  │Terminal │ │ Desktop  │ │  Error Boundary  │ │
│  │  UI     │ │   UI     │ │  (Sentry)        │ │
│  └────┬────┘ └────┬─────┘ └──────────────────┘ │
│       │           │                             │
│  ┌────▼───────────▼──────────────────────────┐  │
│  │         Zustand Stores                    │  │
│  │  osStore │ terminalStore │ aiStore │    │  │
│  │  fsStore │ windowStore   │ gameStore │    │  │
│  │  themeStore │ settingsStore                │  │
│  └───────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────┐  │
│  │  Virtual Filesystem (Fuse.js for search) │  │
│  └──────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────┘
                       │ HTTP / SSE
┌──────────────────────▼──────────────────────────┐
│              Backend (Express)                   │
│  ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │ Chat API │ │ Contact  │ │ Health         │  │
│  │ /v1/chat │ │ /v1/contact │ /v1/health    │  │
│  ├──────────┤ ├──────────┤ ├────────────────┤  │
│  │ Groq SDK │ │ Helmet   │ │ Morgan Logger  │  │
│  │ Llama 3.3│ │ CORS     │ │ Rate Limiter   │  │
│  └──────────┘ └──────────┘ └────────────────┘  │
└──────────────────────────────────────────────────┘
```

## Quick Start

### Prerequisites

- Node.js 22+
- npm

### Local Development

```bash
# Clone the repo
git clone https://github.com/omganesh014/Terminal-Based-Portfolio.git
cd Terminal-Based-Portfolio

# Start backend
cd backend
cp .env.example .env
# Edit .env and add your GROQ_API_KEY (get one at https://console.groq.com/keys)
npm install
npm run dev

# In another terminal, start frontend
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## API Reference

### `GET /api/v1/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "version": "1.0.0",
  "uptime": 3600,
  "ai": true,
  "memory": { "rss": "45MB", "heapUsed": "12MB", "heapTotal": "20MB" },
  "timestamp": "2026-07-16T08:00:00.000Z"
}
```

### `POST /api/v1/chat`
Send a message to the AI assistant (streaming SSE response).

**Request:**
```json
{ "message": "What projects has Om worked on?", "history": [] }
```

**Response (SSE stream):**
```
data: {"text":"Om has worked on..."}
data: {"done":true,"fullText":"Om has worked on..."}
```

### `GET /api/v1/chat?message=...`
Same as POST but for simple queries without history.

### `POST /api/v1/contact`
Submit a contact form.

**Request:**
```json
{ "name": "Jane", "email": "jane@example.com", "subject": "Hello", "message": "Great portfolio!" }
```

**Response:**
```json
{ "status": "logged", "message": "Message received." }
```

## Testing

```bash
# Backend tests
cd backend && npm test

# Frontend unit tests
cd frontend && npm test

# E2E tests (requires preview server)
cd frontend && npm run build && npm run preview &
npx playwright test
```

## CI/CD

The project uses GitHub Actions for continuous integration:

- **Lint**: ESLint with TypeScript rules
- **Test**: All backend and frontend unit tests
- **Build**: Production build with bundle analysis
- **Deploy**: Auto-deploys to GitHub Pages on main branch pushes

## Deployment

### GitHub Pages (automatic via CI)

Push to `main` — CI builds and deploys to GitHub Pages automatically.

### Docker

```bash
docker compose up --build
```

The frontend is served on port 8080 with nginx proxying `/api/` to the backend on port 3001.

### Manual

```bash
cd frontend && npm run build
npx gh-pages -d dist
```

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Yes | Groq API key (get at https://console.groq.com/keys) |
| `CORS_ORIGIN` | No | Comma-separated allowed origins |
| `PORT` | No | Server port (default: 3001) |
| `SENDGRID_API_KEY` | No | SendGrid API key for email |
| `CONTACT_EMAIL_TO` | No | Email to receive contact form submissions |

### Frontend

| Variable | Description |
|----------|-------------|
| `VITE_AI_API_URL` | Custom AI API endpoint |
| `VITE_BASE_PATH` | Custom base path for deployment |
| `VITE_SENTRY_DSN` | Sentry DSN for error tracking |

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Zustand, Xterm.js, React Markdown
- **Backend**: Express, Groq SDK, Helmet, Morgan, express-rate-limit
- **Testing**: Vitest, Playwright, axe-core, Testing Library
- **Quality**: ESLint, Prettier, Husky, TypeScript strict
- **CI/CD**: GitHub Actions, Dependabot

## License

MIT
