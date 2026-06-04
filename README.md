# Agent System UI

A production-ready, full-stack AI agent management platform. Chat with an AI assistant, manage agent registries, design visual workflows, and monitor system health — all from a unified charcoal-themed interface.

![Version](https://img.shields.io/badge/version-3.0.0-blue)
![Docker](https://img.shields.io/badge/docker-ready-green)
![Render](https://img.shields.io/badge/render-deployable-purple)

## What Users Do

Users log in to a secure workspace where they chat with an AI agent that streams real-time responses, drag-and-drop files into conversations, and review persistent chat history. They manage a living registry of AI agents — creating, editing, and organizing cards with custom capabilities, roles, and health metrics. They also design visual workflow graphs by connecting nodes on a canvas, then monitor the entire system's live health through a real-time WebSocket dashboard.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, React Router DOM, Marked |
| Backend | Express 4, WebSocket (ws), Multer |
| Auth | JWT + bcryptjs |
| Validation | Zod |
| Security | Helmet, express-rate-limit, CORS |
| Database | PostgreSQL (production) / JSON files (local dev) |
| AI | Kimi CLI v1.5 (live) or Mock mode |
| Deploy | Docker, Render Blueprint |

## Features

- **JWT Authentication** — Register, login, logout with Bearer token auth on all protected routes
- **Streaming Chat** — Real-time AI responses via ReadableStream, with localStorage persistence (200-msg cap)
- **File Upload** — Drag & drop or click to attach files; images render inline, files show as download cards
- **Agent Registry CRUD** — Create, edit, delete agent cards with name, role, status, tier, capabilities
- **Workflow Visual Designer** — Drag-drop node canvas with SVG connections, properties panel, node palette
- **Live Dashboard** — WebSocket-driven health metrics with auto-reconnect
- **System Blueprint** — 9-slide architecture deck embedded in the app

## Quick Start (Local Dev)

```bash
# 1. Install frontend dependencies
npm install

# 2. Install backend dependencies
cd server && npm install && cd ..

# 3. Start backend dev server
node server/server.js

# 4. Start frontend dev server (new terminal)
npm run dev

# App runs at http://localhost:5173
# API runs at http://localhost:3001
```

## Docker (Local)

```bash
docker build -t agent-system-ui:v3.0 .
docker run -d -p 3002:3001 -e PORT=3001 -e JWT_SECRET=your-secret -e USE_MOCK=true agent-system-ui:v3.0
```

## Deploy to Render

The repo includes a [`render.yaml`](render.yaml) Blueprint. 

1. Push this repo to GitHub
2. Go to [dashboard.render.com/blueprints](https://dashboard.render.com/blueprints)
3. Click **New Blueprint Instance**
4. Connect your GitHub repo

Render automatically provisions a free PostgreSQL database and deploys the Docker container.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Server port (default: 3001) |
| `JWT_SECRET` | **Yes** (production) | Secret for signing JWTs |
| `DATABASE_URL` | No | PostgreSQL connection string (falls back to JSON files) |
| `USE_MOCK` | No | `true` to bypass Kimi CLI and use mock responses |
| `NODE_ENV` | No | `production` enables hardened security settings |
| `CORS_ORIGIN` | No | Restrict API access to a specific frontend domain |

## Testing

```bash
# API unit tests (Node 22 native test runner)
cd tests && API_BASE=http://127.0.0.1:3001 node --test api-unit.test.js

# Stress test
API_BASE=http://127.0.0.1:3001 node stress.test.js

# Full-stack smoke test (Playwright)
cd smoke-test && node smoke.js
```

## Project Structure

```
├── src/                    # React frontend
│   ├── pages/              # Routed pages (Home, Agents, Workflows, etc.)
│   ├── components/         # Reusable components + layout
│   ├── context/            # AuthContext (JWT state)
│   └── api/                # API client modules
├── server/                 # Express backend
│   ├── server.js           # Main entry point
│   ├── db.js               # PostgreSQL / JSON dual-mode adapter
│   └── routes/             # Upload routes
├── tests/                  # Unit + stress tests
├── smoke-test/             # Playwright smoke tests
├── Dockerfile              # Multi-stage Docker build
├── render.yaml             # Render Blueprint
└── DEPLOY.md               # Detailed deployment guide
```

## Security

- Helmet security headers
- Rate limiting on all API routes (100 req/15min), auth endpoints (30 req/15min), chat (20 req/min)
- Zod schema validation on all inputs
- JWT required for protected routes
- CORS restricted in production

## License

MIT
