# Deployment Guide

This guide provides steps to deploy SmartBuy AI to a production-like environment. The repo includes `docker-compose.yml` and `nginx/` config for single-host deployments.

Option A — Single VM (quick):

1. Provision an EC2 instance (Ubuntu 22.04), install Docker & Docker Compose.
2. Clone this repository and copy production environment variables into `backend/.env` and `frontend/.env`.
3. Build images locally or use pre-built images:

```bash
# from repo root
docker compose -f docker-compose.yml pull || true
docker compose -f docker-compose.yml up -d --build
```

4. Configure Nginx (see `nginx/nginx.conf`) as a reverse proxy for `/api` and to serve static frontend files.

Option B — Containers in ECS / Kubernetes (recommended for scale)

1. Build and push Docker images for backend and frontend to ECR.
2. Create ECS task definitions and services, configure ALB, and set environment variables using Secrets Manager.
3. Use CloudWatch for logs and auto-scaling policies.

SSL / HTTPS
- Terminate TLS at ALB or at Nginx. Use ACM for certificate management.

Monitoring and alerts
- Configure CloudWatch alarms for high error rates, high latency, and low instance counts.

Rollback strategy
- Maintain image tags for each deployment; use ECS rolling updates or Docker Compose `up` with previous images to rollback.
