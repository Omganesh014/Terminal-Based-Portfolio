# Project Summary

## What We Built

Production-grade terminal-based portfolio with:
- **Frontend**: React + TypeScript + Zustand + Vite, deployed to GitHub Pages
- **Backend**: Express + Groq API (llama-3.3-70b-versatile) + Helmet CSP + rate limiting
- **CI/CD**: GitHub Actions, Dependabot, Husky + lint-staged, size-limit
- **Security**: CSP with nonces, HSTS, CSRF origin/referer check, input validation, error masking, rate limiting, Sentry

## Critical Bug Fixed: `permissionsPolicy` Middleware Factory

**Root cause**: `server.js` line ~80 had `() => (req, res, next) => {` which creates a **function factory** (returns a middleware function) instead of being a middleware itself. Express called the factory, which ignored `req, res, next`, returned a new middleware without calling `next()`, causing every request to hang indefinitely.

**Fix**: Changed to `(req, res, next) => {` — a proper middleware that calls `next()`.

**Symptoms**: All HTTP requests timed out. The app imported and listened successfully, but Express never responded. Supertest tests timed out at 5s.

## Key Architecture Decisions

- **Nonce CSP**: Per-request nonce middleware runs before helmet; helmet's `scriptSrc` uses `(req, res) => \`'nonce-${res.locals.nonce}'\`` function reference
- **Backend switched to Groq**: Google Gemini free tier quota was exceeded; Groq key is in `backend/.env` (gitignored)
- **Login flow**: Boot → Login (Enter only) → Welcome (typewriter animation) → Desktop (profile auto-opens)
- **Local search**: Fuse.js on `portfolio.json` (26 entries) for instant offline answers before API call

## Test Structure

- **Backend**: 22 tests (health, chat validation, injection, contact, security headers x8, 404, CSP report, rate limit)
- **Frontend**: 57 tests (6 store suites + terminal + RTL + existing)

## Commit History

| Hash | Message | Notes |
|------|---------|-------|
| `153aef9` | `security: maximum hardening` | Husky lint-staged reverted server.js; had to re-apply |
| (next) | `fix: permissionsPolicy middleware factory bug` | The `() => () =>` bug caused all requests to hang |

## Deployment

- GitHub Pages auto-deploy from `main` (see `.github/workflows/ci.yml`)
- Docker: nginx reverse-proxies to backend at `http://backend:3001`
- No SSH keys configured on this machine — push requires PAT or manual action

## Environment Variables (backend/.env)

```
GROQ_API_KEY=...          # Required for Groq chat
CORS_ORIGIN=...            # Default: http://localhost:5173,http://localhost:4173
SENTRY_DSN=...             # Optional
CONTACT_EMAIL_TO=...       # Optional, for SendGrid contact form
SENDGRID_API_KEY=...       # Optional
```

## Useful Commands

```bash
# Backend
cd backend && npm run dev    # Dev server with nodemon
cd backend && npm test       # Vitest

# Frontend
cd frontend && npm run dev   # Vite dev server
cd frontend && npm test      # Vitest
cd frontend && npm run build # Production build

# Lint
npx eslint src/              # Backend or frontend
npx prettier --check .       # Root-level
```
