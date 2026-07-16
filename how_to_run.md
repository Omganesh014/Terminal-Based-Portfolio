# Terminal 1 — Backend
cd backend && cp .env.example .env
# Edit .env → set GROQ_API_KEY (already done)
npm install && npm run dev

# Terminal 2 — Frontend
cd frontend && npm install && npm run dev
Then open http://localhost:5173/Terminal-Based-Portfolio/. The frontend proxies /api → localhost:3001.