# OmOS Execution Plan

Source analyzed: [OmOS_Master_Blueprint.pdf](OmOS_Master_Blueprint.pdf)

This plan turns the blueprint into an execution sequence that ships in demoable increments. The order follows the blueprint’s own roadmap, with each phase ending in a working, reviewable state before the next phase begins.

## Repository Layout

- `frontend/` contains the Vite React application, terminal runtime, and shared UI/stores.
- `backend/` is reserved for the future API/proxy layer.
- `docs/` contains the blueprint and living project planning documents.

## Execution Principles

- Build the shell experience before chasing advanced features.
- Keep the client-side OS simulation independent from the server proxy layer.
- Every phase must end with something usable, not just code that compiles.
- Recruiter value comes first: clarity, speed to signal, and polish matter more than feature count.
- Defer optional simulations until the core portfolio experience is already strong.

## Phase 0 - Foundation

Goal: establish the repo, tooling, state architecture, and a typed terminal that can accept input.

Work items:

1. Initialize the application stack with Vite, React, TypeScript, ESLint, Prettier, and the project folder structure.
2. Set up environment handling, CI/CD basics, and Docker configuration.
3. Create the core Zustand stores: `osStore`, `terminalStore`, `filesystemStore`, `windowStore`, `themeStore`, and `settingsStore`.
4. Integrate xterm.js with responsive resizing and clickable links.
5. Implement raw keystroke capture, prompt rendering, backspace, enter handling, and terminal echo.

Deliverable:

- A working terminal that accepts typing and renders output reliably.

Exit criteria:

- The terminal is usable in the browser.
- State is centralized and typed.
- Basic tests cover input handling.

## Phase 1 - Core OS

Goal: turn the terminal into a real OS-like interface with boot flow, filesystem, and command execution.

Work items:

1. Build the boot animation with timed boot stages and a skip option.
2. Implement the virtual filesystem with directories for Projects, Experience, Education, Skills, Certificates, Achievements, Contact, and hidden content.
3. Implement the shell tokenizer, command registry, command metadata, piping, redirection, and chaining.
4. Add the first command set: `ls`, `cd`, `pwd`, `cat`, `tree`, `history`, `whoami`, `help`, and related filesystem commands.
5. Add renderers for the supported file types.

Deliverable:

- A bootable shell with a working filesystem and at least 15 commands.

Exit criteria:

- Boot sequence is stable and skippable.
- VFS can represent real portfolio content.
- Commands behave consistently and are registry-driven.

## Phase 1.5 - Portfolio Ready

Goal: make the shell useful as a public portfolio.

Work items:

1. Populate the actual portfolio content: projects, resume, experience, skills, certificates, and achievements.
2. Add GitHub integration for live profile and repo data.
3. Add 2 to 3 polished themes.
4. Add the architecture-view command that explains the system itself.

Deliverable:

- A version safe to share publicly as a portfolio.

Exit criteria:

- A recruiter can understand the developer from the app within a few minutes.
- The content is real, not placeholder-heavy.
- Visual polish is intentional and consistent.

## Phase 2 - Recruiter Edition

Goal: reduce recruiter effort with guided discovery.

Work items:

1. Build Recruiter Mode with guided steps.
2. Add role-based filtering and quick stats.
3. Validate the flow with at least one real recruiter or hiring-adjacent user.

Deliverable:

- A guided experience that surfaces the most relevant information quickly.

Exit criteria:

- The guided flow clearly improves speed to understanding.
- Feedback from a recruiter informs the next iteration.

## Phase 3 - AI Edition

Goal: add a portfolio-scoped AI assistant with safety controls.

Work items:

1. Wire Gemini into an assistant scoped to portfolio knowledge only.
2. Add prompt-injection defenses and request limiting.
3. Keep the assistant aligned with the portfolio data model, not general chat.

Deliverable:

- A safe, useful portfolio assistant.

Exit criteria:

- The assistant answers only portfolio-relevant questions.
- Abuse controls and guardrails are present from launch.

## Phase 4 - Optional Advanced OmOS

Goal: build the high-complexity extras only after the core product has proven itself.

Work items:

1. Plugin system.
2. Package manager simulation.
3. SQL CLI.
4. Network stack simulation.
5. Games, playground, and presence features.

Deliverable:

- Advanced simulation features for v3.0 and beyond.

Exit criteria:

- Only start after the earlier versions are validated and well received.

## Recommended Build Order

1. Phase 0
2. Phase 1
3. Phase 1.5
4. Phase 2
5. Phase 3
6. Phase 4 only if the project has already proven itself

## Definition Of Done For Each Step

A step is complete when:

- The code is implemented.
- The relevant UI or command path works end to end.
- Tests or validation are run.
- The progress tracker is updated.

## Progress Tracker

Update the matching checkbox and status note when each step is completed.

### Phase 0 - Foundation

- [ ] 0.1 Project setup
- [x] 0.2 State management setup
- [x] 0.3 Terminal foundation

### Phase 1 - Core OS

- [x] 1.1 Boot sequence
- [ ] 1.2 Virtual file system
- [ ] 1.3 Shell parser and command execution

### Phase 1.5 - Portfolio Ready

- [ ] 1.4 Portfolio content and live integrations
- [ ] 1.5 Theme polish and architecture view

### Phase 2 - Recruiter Edition

- [ ] 2.1 Recruiter mode
- [ ] 2.2 Recruiter validation pass

### Phase 3 - AI Edition

- [ ] 3.1 Portfolio-scoped AI assistant
- [ ] 3.2 Safety and rate limiting

### Phase 4 - Optional Advanced OmOS

- [ ] 4.1 Plugin and package simulations
- [ ] 4.2 SQL, network, games, and multiplayer extras
