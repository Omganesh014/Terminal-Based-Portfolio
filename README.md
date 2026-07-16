# OM — Terminal-Based Developer Portfolio

[![CI](https://github.com/omganesh014/Terminal-Based-Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/omganesh014/Terminal-Based-Portfolio/actions/workflows/ci.yml)

An interactive, terminal-themed developer portfolio that simulates a desktop OS. Navigate projects, skills, and experience through a command-line interface or a visual workspace — no typing required.

<video src="./assets/demo.mp4" controls width="100%" style="max-width: 720px; border-radius: 6px;"></video>

---

## Features

- **Recruiter Mode** — Role-based guided tour (frontend / full-stack / backend / AI-ML) with curated projects, highlights, and a 3-minute inspection path
- **Desktop Workspace** — Graphical interface with resizable windows for profile, resume, projects, skills, contact, and more
- **Terminal Shell** — Boot sequence, login gate, and a functional shell with `ls`, `cd`, `cat`, `tree`, `find`, `grep`, pipes, and redirection
- **AI Assistant** — Ask questions about the portfolio; backed by Groq (Llama 3.3) with offline Fuse.js fallback
- **Virtual Filesystem** — Browse `/home/omganesh` with real directory and file operations
- **Mini Games** — Snake and Tic-Tac-Toe playable from the terminal
- **Theme System** — Midnight, Ember, Aurora, and Neon themes
- **Progressive Web App** — Installable with offline support via `vite-plugin-pwa`
- **Responsive** — Desktop-first with mobile-aware layouts

---

## Quick Start

```bash
# Prerequisites: Node.js 22+, npm

# Clone
git clone https://github.com/omganesh014/Terminal-Based-Portfolio.git
cd Terminal-Based-Portfolio

# Backend
cd backend
cp .env.example .env
# Edit .env — add your GROQ_API_KEY (get one at https://console.groq.com/keys)
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## Architecture

```
┌────────────────────────────────────────────────┐
│                   Frontend (Vite + React)        │
│  ┌──────────┐ ┌───────────┐ ┌────────────────┐ │
│  │ Terminal │ │  Desktop  │ │  Error         │ │
│  │    UI    │ │    UI     │ │  Boundary      │ │
│  └────┬─────┘ └────┬──────┘ └────────────────┘ │
│       │            │                            │
│  ┌────▼────────────▼────────────────────────┐   │
│  │         Zustand Stores                   │   │
│  │  OS / Terminal / AI / FS / Window / Game │   │
│  │  Theme / Settings                        │   │
│  └──────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │  Virtual Filesystem (Fuse.js fallback)   │   │
│  └──────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────┘
                       │ HTTP / SSE
┌──────────────────────▼──────────────────────────┐
│              Backend (Express)                   │
│  ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │ Chat API │ │ Contact  │ │ Health         │  │
│  │ /v1/chat │ │ /v1/     │ │ /v1/health     │  │
│  │          │ │ contact  │ │                │  │
│  ├──────────┤ ├──────────┤ ├────────────────┤  │
│  │ Groq SDK │ │ Helmet   │ │ Morgan Logger  │  │
│  │ Llama 3.3│ │ CORS     │ │ Rate Limiter   │  │
│  └──────────┘ └──────────┘ └────────────────┘  │
└──────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 19, TypeScript, Vite, Zustand, Xterm.js, React Markdown |
| **Backend** | Express, Groq SDK, Helmet, Morgan, express-rate-limit |
| **Testing** | Vitest, Playwright, axe-core, Testing Library |
| **Quality** | ESLint, Prettier, Husky, TypeScript (strict) |
| **CI/CD** | GitHub Actions, Dependabot, GitHub Pages |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Yes | Groq API key |
| `CORS_ORIGIN` | No | Comma-separated allowed origins |
| `PORT` | No | Server port (default: 3001) |
| `SENDGRID_API_KEY` | No | SendGrid API key for email |
| `CONTACT_EMAIL_TO` | No | Email to receive contact submissions |

### Frontend

| Variable | Description |
|----------|-------------|
| `VITE_AI_API_URL` | Custom AI API endpoint |
| `VITE_BASE_PATH` | Custom base path for deployment |
| `VITE_SENTRY_DSN` | Sentry DSN for error tracking |

---

## Deployment

```bash
# GitHub Pages (automatic)
# Push to main → CI builds and deploys

# Docker
docker compose up --build

# Manual
cd frontend && npm run build
npx gh-pages -d dist
```

---

## License

MIT
