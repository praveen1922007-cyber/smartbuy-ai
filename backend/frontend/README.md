SmartBuy AI — Frontend

This is the frontend project (Vite + React + TypeScript + Tailwind).

Local development
1. Copy .env.example to .env and set VITE_API_URL if desired (defaults to http://localhost:4000/api)
2. Install dependencies:
   cd frontend
   npm install
3. Run dev server:
   npm run dev

Vite dev proxy
- The dev server is configured to proxy /api requests to http://localhost:4000 so you can run backend locally and keep API calls as relative paths.

Build
- npm run build will produce static assets in frontend/dist

Deploy
- CI pipeline builds the frontend and uploads artifacts. For EC2-based deployment, the built artifacts are SCP'd to /opt/smartbuy/frontend and served by Nginx.

Environment variables
- VITE_API_URL should point to the backend API (e.g., https://api.smartbuy.ai/api). This variable is embedded at build time.
