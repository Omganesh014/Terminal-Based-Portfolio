# OM — Terminal-Based Portfolio

OM is OmGanesh R Matiwade’s interactive developer portfolio. It uses a terminal-native operating-system theme while keeping every portfolio section accessible from the main workspace—no terminal commands required.

[GitHub repository](https://github.com/Omganesh014/Terminal-Based-Portfolio) · [GitHub profile](https://github.com/Omganesh014)

## Screenshots

| Boot console | Access gate |
| --- | --- |
| ![OM boot console](docs/screenshots/boot-screen.png) | ![OM access gate](docs/screenshots/login-screen.png) |

## Features

- Animated terminal boot sequence, access gate, logout, sign-out, shutdown, and reboot flows.
- Keyboard-accessible main workspace with direct navigation to Profile, Resume, Projects, Experience, Education, Skills, Certificates, Achievements, and Contact.
- Clickable project browser with complete summaries, problems solved, tech stacks, features, roles, achievements, repository links, and the SpendDay demo video.
- Responsive mobile layout for the workspace, dialogs, project pages, contact links, and long project details.
- Downloadable resume from the Resume section.
- Terminal-style social links for Instagram, GitHub, LinkedIn, and email.
- Optional xterm.js shell with command history, case-insensitive portfolio paths, filesystem navigation, pipes, redirects, and command chaining.
- Store-backed virtual filesystem and local portfolio content.
- 4 distinct visual themes (midnight, ember, aurora, neon) applied consistently across desktop UI and terminal.
- AI Assistant with Gemini 2.0 Flash — portfolio-scoped knowledge, SSE streaming responses, markdown rendering, follow-up suggestions, conversation persistence, chat export, and animated typing indicator.
- Prompt-injection detection and rate limiting on the backend proxy.
- `ask` terminal command that streams AI responses directly in the xterm.js shell.

## Plan Vs Execution

The original execution plan lives in [docs/OMOS_EXECUTION_PLAN.md](docs/OMOS_EXECUTION_PLAN.md). This table tracks how the shipped work compares to that roadmap.

| Original plan | Execution status | Notes |
| --- | --- | --- |
| Phase 0 - Foundation | Complete | Repo setup, state stores, xterm.js terminal, and validation are in place. |
| Phase 1 - Core OS | Complete | Boot flow, virtual filesystem, shell parsing, piping, redirects, and chaining are implemented. |
| Phase 1.5 - Portfolio Ready | Complete | Real portfolio content, resume download, live GitHub integration, a contact form, architecture-view, and four polished themes (midnight, ember, aurora, neon) are implemented. |
| Phase 2 - Recruiter Edition | Complete | Guided recruiter mode with role-based highlighting and a 3-minute path are shipped. |
| Phase 3 - AI Edition | Complete | Portfolio-scoped AI assistant with Gemini integration, prompt-injection defenses, and rate limiting. |
| Phase 4 - Optional Advanced OM | Not started | Plugin, package manager, SQL, network, and game simulations remain future work. |

### What is already shipped beyond the original baseline

- Resume content is extracted into the UI and is downloadable from the Resume section.
- About me copy is added as a dedicated portfolio section.
- Copy-email support is available in Contact.
- Analytics are gated so they only load after deployment.
- Live GitHub/profile integrations are implemented with caching and fallback.
- Themed variants expanded to 4 polished variants (midnight, ember, aurora, neon).
- Recruiter mode is implemented via guided recruiter flow with role-based highlighting and validated.
- Portfolio-scoped AI assistant with Gemini 2.0 Flash, SSE streaming, markdown rendering, follow-up suggestion chips, conversation persistence (localStorage), chat export, retry on error, and animated typing indicator.
- Backend Express proxy for the AI assistant with prompt-injection detection, rate limiting (10 req/min), and input validation.
- Docker Compose wiring for both frontend (nginx) and backend (Node.js) services.
- `ask` terminal command with async inline streaming response in xterm.js shell.
- Playwright coverage exists for login, project navigation, fullscreen, and shutdown behavior.



## Tech stack

**Frontend:** React 19, TypeScript, Vite, Zustand, xterm.js, react-markdown, Tailwind CSS
**Backend:** Node.js, Express, Gemini API, express-rate-limit
**Tooling:** Vitest, Playwright, ESLint, Prettier, Docker, nginx

## Run locally

### Frontend only (static portfolio without AI)

Prerequisites: Node.js 20+ and npm.

```bash
git clone https://github.com/Omganesh014/Terminal-Based-Portfolio.git
cd Terminal-Based-Portfolio/frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

### Full stack (with AI assistant)

Prerequisites: Node.js 20+, npm, and a [Gemini API key](https://aistudio.google.com/apikey).

```bash
# Terminal 1 — backend
cd backend
cp .env.example .env
# Edit .env and set GEMINI_API_KEY=your_key_here
npm install
npm run dev

# Terminal 2 — frontend
cd frontend
npm install
npm run dev
```

The frontend proxies `/api` requests to the backend in development mode. Open `http://localhost:5173`.

### Quality checks

```bash
npm run test
npm run lint
npm run build
```

### Docker

Requires a Gemini API key. Set it in a `.env` file in the project root:

```bash
cp backend/.env.example .env
# Edit .env and set GEMINI_API_KEY=your_key_here
docker compose --env-file .env up --build
```

Open `http://localhost:8080` after the containers start.

## Project structure

```text
frontend/   # Vite React application, workspace UI, terminal runtime, stores, and AI assistant UI
backend/    # Express proxy server for AI assistant (Gemini API, rate limiting, prompt-injection defense)
docs/       # Project plans, progress log, and README screenshots
```

## License

Licensed under the [MIT License](LICENSE).
