# AWS Setup (high-level)

This project targets AWS for production deployment. Below are recommended services and an outline for provisioning.

Core services
- EC2 / Auto Scaling Groups or ECS Fargate — run backend containers or Node app.
- S3 — static hosting for frontend assets or storage for images/receipts.
- CloudFront — CDN in front of S3 for global caching.
- Cognito — user authentication and social login.
- API Gateway + Lambda (optional) — serverless API or proxy to backend.
- Bedrock — optional for LLM-based AI modules.
- CloudWatch — logging, metrics, alarms.
- Secrets Manager — store DB and API keys securely.

Basic deployment steps (EC2/ECS)

1. Build containers using existing `Dockerfile` in `backend/` and `frontend/`.
2. Push images to ECR: create repositories and push tags.
3. Create ECS task definitions or EC2 AMI with Docker Compose.
4. Configure load balancer (ALB) and route traffic to backend service and frontend (S3/CloudFront preferred for frontend).
5. Configure environment variables via ECS task definition or Secrets Manager.

Networking & security
- Place backend in private subnets with NAT for outbound access to external APIs.
- Use security groups to restrict database access.
- Use IAM roles for ECS tasks to access S3/Secrets Manager/CloudWatch.

Optional: CI/CD
- Use GitHub Actions to build containers, push to ECR, and update ECS service via `aws ecs update-service` or CloudFormation / CDK.
