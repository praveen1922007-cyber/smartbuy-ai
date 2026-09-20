# SmartBuy AI

SmartBuy AI is a production-grade SaaS for local shopping comparison — finds best nearby stores by comparing price, distance, availability, offers and AI recommendations.

This repository contains a TypeScript/Node backend and a React + Vite frontend. It includes mocked marketplace adapters (Amazon/Flipkart/Blinkit/Meesho), persistence for vendor products and price history, a comparison UI, and CI with Playwright E2E tests.

Folders
- `backend/` — Node.js + Express API (TypeScript, Mongoose)
- `frontend/` — React + Vite TypeScript app (Tailwind)
- `.github/workflows/ci.yml` — CI: backend integration tests, frontend unit + E2E tests
- `nginx/`, `docker-compose.yml` — Docker / nginx artifacts

Quick start (local development)

1. Start MongoDB (local or Atlas). Example using Docker:

```bash
docker run -d -p 27017:27017 --name smartbuy-mongo mongo:6
```

2. Backend (dev):
```bash
cd backend
npm install
cp .env.example .env   # set MONGODB_URI if needed
npm run dev
```

3. Frontend:
```bash
cd frontend
npm install
npm run dev
```

Run integration test (backend):
```bash
cd backend
npm run test:integration
```

Run frontend unit tests:
```bash
cd frontend
npm test
```

Run Playwright E2E (after building & preview):
```bash
cd frontend
npm run build
npm run preview
npx playwright install --with-deps
npm run test:e2e
```

Environment / Deployment documentation: see `docs/` for detailed guides (DB, AWS, env vars, deployment steps).
# SmartBuy AI

SmartBuy AI is a premium local shopping comparison platform designed for nearby stores, AI recommendations, pricing insights and modern store-owner dashboards.

## Architecture

- Frontend: React + TypeScript + Tailwind + Vite (hosted on **Cloudflare Pages**)
- Backend: Node.js + Express + JWT + REST APIs
- Database: MongoDB Atlas ready with Mongoose models
- AI: Bedrock-ready recommendation service
- Deployment: Cloudflare Pages + Docker (optional)

## Quick start (local)

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

API runs at `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs at `http://localhost:5173` and proxies `/api` to the backend.

## API highlights

- Authentication: `/api/auth/register`, `/api/auth/login`
- Products: `/api/products`
- Stores: `/api/stores`
- AI recommendations: `/api/ai/recommendation`
- Analytics: `/api/analytics/summary`

## Deploy frontend to Cloudflare Pages

You can deploy from the Cloudflare dashboard **or** via GitHub Actions. Both options keep GitHub as the source repo and publish to Cloudflare.

### Option A: Cloudflare Dashboard (recommended)

1. Push this repo to GitHub.
2. Open [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select your GitHub repository.
4. Use these build settings:

| Setting | Value |
|---------|-------|
| Production branch | `main` |
| Root directory | `frontend` |
| Build command | `npm run build` |
| Build output directory | `dist` |

5. Add environment variables (Settings → Environment variables):

| Variable | Example | Notes |
|----------|---------|-------|
| `VITE_API_URL` | `https://your-api.example.com/api` | Your hosted backend URL |

6. Deploy. Cloudflare will give you a URL like `https://smartbuy-ai.pages.dev`.

### Option B: GitHub Actions + Wrangler

1. In Cloudflare: **My Profile** → **API Tokens** → create a token with **Cloudflare Pages Edit** permission.
2. Copy your **Account ID** from the Cloudflare dashboard URL or overview page.
3. In GitHub repo settings → **Secrets and variables** → **Actions**, add:

| Secret / Variable | Value |
|-------------------|-------|
| `CLOUDFLARE_API_TOKEN` (secret) | Your Cloudflare API token |
| `CLOUDFLARE_ACCOUNT_ID` (secret) | Your Cloudflare account ID |
| `VITE_API_URL` (variable, optional) | Backend API URL for production |

4. Push to `main`. The workflow in `.github/workflows/deploy.yml` builds and deploys automatically.

### Option C: Manual deploy with Wrangler CLI

```bash
npm install -g wrangler
wrangler login
cd frontend
npm install
npm run build
wrangler pages deploy dist --project-name=smartbuy-ai
```

## Backend hosting

Cloudflare Pages serves the React frontend only. Host the Express API separately (Render, Railway, Fly.io, a VPS, etc.) and point `VITE_API_URL` to that URL.

On the backend, set:

```env
FRONTEND_URL=https://your-app.pages.dev
MONGODB_URI=your-mongodb-atlas-uri
JWT_SECRET=your-production-secret
```

## Docker (local / self-hosted)

```bash
docker compose up --build
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

## Project structure

```
NITHACTHON/
├── frontend/          # React app (Cloudflare Pages)
├── backend/           # Express API
├── wrangler.toml      # Cloudflare Pages config
└── docker-compose.yml # Local full-stack setup
```
