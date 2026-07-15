# OM — Terminal-Based Portfolio

[![CI](https://github.com/Omganesh014/Terminal-Based-Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Omganesh014/Terminal-Based-Portfolio/actions/workflows/ci.yml)
[![Deploy](https://github.com/Omganesh014/Terminal-Based-Portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/Omganesh014/Terminal-Based-Portfolio/actions/workflows/deploy.yml)
[![GitHub Pages](https://img.shields.io/badge/hosted-on%20GitHub%20Pages-blue?logo=github)](https://omganesh014.github.io/Terminal-Based-Portfolio/)

OM is OmGanesh R Matiwade's interactive developer portfolio — a simulated OS that turns exploring projects, skills, and experience into a memorable experience. Every section is accessible from the workspace without touching the terminal.

[GitHub repository](https://github.com/Omganesh014/Terminal-Based-Portfolio) · [GitHub profile](https://github.com/Omganesh014) · [Live site](https://omganesh014.github.io/Terminal-Based-Portfolio/)

## Features

- **OS simulation** — animated boot, access gate, logout, sign-out, shutdown, reboot
- **Workspace UI** — keyboard-navigable desktop with Profile, Resume, Projects, Experience, Education, Skills, Certificates, Achievements, Contact
- **Project browser** — details for 9 projects: problem, tech stack, features, role, achievement, GitHub link
- **xterm.js terminal** — 30+ commands, piping, redirection, chaining, Tab completion, Ctrl+L, command history
- **Virtual filesystem** — mutable directories with resume.md, skills.md, and per-project markdown
- **AI Assistant** — Gemini 2.0 Flash, SSE streaming, markdown rendering, follow-up chips, conversation persistence, retry
- **Terminal games** — playable Snake (WASD/arrows) and Tic-Tac-Toe (1-9), Matrix rain
- **SQL CLI** — `sql SELECT * FROM projects WHERE role LIKE '%Full-stack%'` across 5 portfolio tables
- **Network stack** — `ping`, `curl`, `netstat`, `traceroute`, `ifconfig`, `nslookup` simulations
- **Package manager** — `om-pkg install/remove/list/info/search` for portfolio feature packages
- **Plugin system** — `plugin list/install/remove/available` for extensibility
- **4 themes** — midnight, ember, aurora, neon applied consistently across desktop and terminal
- **Live GitHub data** — profile and repos with caching and fallback
- **Contact form** — sends to backend API and falls back to email client
- **PWA support** — installable, standalone manifest, theme-color meta tags
- **Mobile responsive** — breakpoints at 480px and 650px

## Try it from the terminal

```bash
cat resume.md                               # Read the full resume
cat skills.md                               # Read the skills matrix
sql SELECT * FROM projects WHERE role LIKE 'Full-stack' ORDER BY name
om-pkg list                                 # See installed packages
ping github.com                             # Simulated ping
snake                                       # Play Snake (WASD / arrow keys)
ttt                                         # Play Tic-Tac-Toe (1-9)
ask "What projects use React?"              # Ask the AI assistant
find -name spendday                         # Search filesystem
plugin list                                 # List installed plugins
matrix                                      # Matrix digital rain
help                                        # All available commands
```

## Plan vs Execution

The original plan lives in [docs/OMOS_EXECUTION_PLAN.md](docs/OMOS_EXECUTION_PLAN.md).

| Phase | Status | Notes |
| --- | --- | --- |
| 0 — Foundation | Complete | Repo setup, state stores, xterm.js terminal |
| 1 — Core OS | Complete | Boot flow, VFS, shell parsing, pipes, redirects |
| 1.5 — Portfolio Ready | Complete | Real content, GitHub integration, 4 themes, architecture-view |
| 2 — Recruiter Edition | Complete | Guided recruiter mode with role-based highlighting |
| 3 — AI Edition | Complete | Gemini assistant, prompt-injection defense, rate limiting |
| 4 — Optional Advanced | Complete | Plugin system, SQL CLI, package manager, network stack, games |

### Beyond the original plan

Live GitHub caching/fallback, copy-email, Docker Compose, Playwright e2e tests, analytics gated to prod, auto-deploy via GitHub Actions, PWA manifest, Tab completion, Ctrl+L, `find` command, mobile-responsive CSS, playable terminal games, real contact backend endpoint.

## Tech stack

**Frontend:** React 19, TypeScript, Vite, Zustand, xterm.js, react-markdown  
**Backend:** Node.js, Express, Google Gemini API, express-rate-limit  
**Tooling:** Vitest, Playwright, ESLint, Prettier, Docker, GitHub Actions

## Run locally

### Frontend only

```bash
git clone https://github.com/Omganesh014/Terminal-Based-Portfolio.git
cd Terminal-Based-Portfolio/frontend
npm install && npm run dev
```

Open `http://localhost:5173`.

### Full stack (with AI)

```bash
# Terminal 1 — backend
cd backend && cp .env.example .env
# Edit .env → set GEMINI_API_KEY
npm install && npm run dev

# Terminal 2 — frontend
cd frontend && npm install && npm run dev
```

The frontend proxies `/api` → `localhost:3001` in dev mode.

### Quality

```bash
npm run test && npm run lint && npm run build
```

### Deploy backend 24/7 (free)

The AI assistant and contact form need a running backend. Deploy to Render's free tier:

1. Push the `backend/` folder to a separate repo (or use the monorepo)
2. On [Render](https://render.com) → New Web Service → connect your repo
3. Set:
   - **Root directory:** `backend`
   - **Build command:** `npm install`
   - **Start command:** `node src/server.js`
   - **Environment variables:**
     - `GEMINI_API_KEY` — your Google AI key
     - `CORS_ORIGIN` — `https://omganesh014.github.io`
     - `PORT` — `10000`
4. After deploy, set `VITE_AI_API_URL=https://your-app.onrender.com/api/chat` in the frontend build

The free tier spins down after 15 min of inactivity but wakes on the next request (takes ~30s).

### Docker

```bash
cp backend/.env.example .env   # set GEMINI_API_KEY
docker compose --env-file .env up --build
```

Open `http://localhost:8080`.

## Project structure

```text
frontend/    React + Vite app, workspace UI, terminal, stores, AI chat
backend/     Express proxy for Gemini API, rate limiting, contact endpoint
docs/        Execution plan, progress log, screenshots
```

## License

MIT
