# Environment Variables

This file lists environment variables used by the backend and frontend.

Backend (`backend/.env`)
- `MONGODB_URI` — MongoDB connection string. Example: `mongodb://127.0.0.1:27017/smartbuy`
- `PORT` — Backend port (default `4000`).
- `JWT_SECRET` — JWT signing secret for auth.
- `AWS_REGION` — AWS region used for services.
- `S3_BUCKET` — S3 bucket name for file storage.
- `BEDROCK_ENDPOINT` — (optional) Bedrock endpoint for AI.
- `GOOGLE_MAPS_API_KEY` or `AWS_LOCATION_KEY` — for distance / maps integration.

Frontend (`frontend/.env`)
- `VITE_API_URL` — Backend API base URL (defaults to `/api`).

Notes
- Never commit real secrets. Use GitHub Secrets or AWS Secrets Manager for production.
- For local development, copy `.env.example` into `.env` and populate values.
