# API Overview

This document lists important API endpoints implemented in the backend. All endpoints are under `/api` by default when frontend proxies to backend.

Marketplace endpoints
- `GET /api/marketplace/compare?barcode=...&lat=...&lon=...` — query mock adapters for marketplace results and returns scored results.
- `POST /api/marketplace/ingest` — body: `{ barcode, lat?, lon? }` — fetches from adapters and persists vendor products + price history.
- `GET /api/marketplace/history?barcode=...` — returns persisted vendor products and price history for a barcode.

Product & Store (existing)
- `GET /api/stores` — list stores
- `GET /api/products` — list products
- `GET /api/products/:id` — product details

Auth (placeholders)
- JWT-based auth endpoints exist under `/api/auth` for registration, login, password reset.

Notes
- All endpoints implement basic validation and error handling. Add authentication and RBAC for production-sensitive endpoints.
- Swagger documentation: generate using `swagger-jsdoc` + `swagger-ui-express` in `backend` if desired.
