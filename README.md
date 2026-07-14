# OmOS — Terminal-Based Portfolio

OmOS is an interactive developer portfolio that presents itself as a small operating system. Instead of a conventional landing page, visitors boot into a simulated environment, unlock a desktop, and explore portfolio information through an xterm.js-powered terminal.

Repository: [github.com/Omganesh014/Terminal-Based-Portfolio](https://github.com/Omganesh014/Terminal-Based-Portfolio)

Created by [Omganesh Matiwade](https://github.com/Omganesh014).

The project is currently a frontend-first prototype. The user experience and terminal shell run entirely in the browser; the `backend/` directory is reserved for future API and proxy services.

## Highlights

- Animated OmOS boot sequence with a skip control
- Password-style login gate and restart option
- Keyboard-accessible desktop with profile, resume, projects, skills, and terminal apps
- Functional terminal powered by xterm.js
- In-browser commands, filesystem navigation, command history, and command palette
- React, TypeScript, Vite, and Zustand state management

## Project structure

```text
.
├── frontend/                 # Vite + React application
│   ├── src/components/       # Boot, login, desktop, and terminal UI
│   ├── src/lib/terminal.ts   # Virtual filesystem and command handling
│   └── src/stores/           # Zustand OS, terminal, and theme state
├── backend/                  # Reserved for future API/proxy services
├── docs/                     # Blueprint, execution plan, and progress log
└── README.md
```

## Technology

| Area | Tools |
| --- | --- |
| Application | React 19, TypeScript, Vite |
| Terminal | xterm.js, Fit Addon, Web Links Addon |
| State | Zustand |
| Quality tooling | ESLint, Prettier |

## Getting started

### Prerequisites

- Node.js 20 or later
- npm

### Run locally

```bash
git clone https://github.com/Omganesh014/Terminal-Based-Portfolio.git
cd Terminal-Based-Portfolio
cd frontend
npm install
npm run dev
```

Vite prints the local address in the terminal—normally `http://localhost:5173`.

### Production build

```bash
cd frontend
npm run build
npm run preview
```

### Lint

```bash
cd frontend
npm run lint
```

## Using OmOS

1. Let the boot animation complete or select **Skip boot**.
2. On the login screen, enter any value and press Enter to unlock the desktop.
3. Select an app with the mouse, or use Arrow keys and Enter.
4. Open **Terminal** to inspect the portfolio shell. Press Escape in an empty terminal prompt to return to the desktop.

The terminal includes a command picker below the terminal window. Use Arrow keys to choose a suggested command and press Enter, or type directly.

### Supported commands

| Command | Description |
| --- | --- |
| `help` | Lists available commands |
| `clear` / `cls` | Clears the terminal |
| `whoami` | Prints the active user |
| `pwd` | Prints the current directory |
| `ls [path]` | Lists a directory |
| `cd [path]` | Changes directory |
| `cat <file>` | Reads a portfolio file |
| `tree` | Shows the current portfolio tree |
| `echo <text>` | Prints text |
| `about` | Describes OmOS |

Example session:

```text
omos@portfolio:/home/omos$ ls
projects
resume.md
skills.md
contact.md

omos@portfolio:/home/omos$ cat resume.md
```

The demo virtual filesystem includes `/home/omos`, portfolio files such as `resume.md` and `skills.md`, and a `projects/terminal-based-portfolio` entry.

## Current status

Implemented:

- Repository split into frontend, backend, and docs areas
- Zustand-backed OS, terminal, and theme state
- xterm.js terminal runtime with resizing, basic parsing, history, and filesystem commands
- Boot, login, desktop, and terminal navigation flow

Planned:

- Richer virtual filesystem and shell capabilities
- Real portfolio content, GitHub integration, and additional themes
- Recruiter mode and portfolio-scoped AI assistant
- Backend API/proxy layer and optional advanced simulations

The detailed roadmap and completion log are available in [the execution plan](docs/OMOS_EXECUTION_PLAN.md) and [progress log](docs/OMOS_PROGRESS.md).

## Development notes

- The terminal data is intentionally local and currently defined in `frontend/src/lib/terminal.ts`.
- The login form is an interface element, not authentication; submitting it unlocks the desktop.
- `backend/` has no runnable service yet.

## License

This project is licensed under the [MIT License](LICENSE).
