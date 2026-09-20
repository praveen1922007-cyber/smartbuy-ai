SmartBuy AI — Deployment Guide

This document explains how to deploy the backend to AWS EC2 using Docker and GitHub Actions with ECR as the image registry.

Prerequisites
- AWS account
- EC2 instance (Ubuntu 22.04 recommended) with Docker and Docker Compose installed
- AWS CLI installed on EC2 and configured with an IAM user that can access ECR (or provide GitHub Actions with AWS credentials)
- GitHub repository with this project

High-level flow
1. GitHub Action builds Docker image and pushes to Amazon ECR
2. On success, GitHub Action SSHs to EC2 and pulls the latest image and restarts services using docker-compose.prod.yml

GitHub Secrets (set in repository Settings -> Secrets)
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_REGION (e.g., ap-south-1)
- ECR_REGISTRY (e.g., 123456789012.dkr.ecr.ap-south-1.amazonaws.com)
- ECR_REPOSITORY (e.g., smartbuy-backend)
- EC2_HOST (public IP or DNS of EC2)
- EC2_USER (e.g., ubuntu)
- EC2_SSH_KEY (private SSH key, base64 or plain content)
- EC2_SSH_PORT (optional, default 22)

EC2 Setup (summary)
1. Launch EC2 instance with appropriate security group (allow SSH from your IP, HTTP/HTTPS from 0.0.0.0/0, and any other ports needed).
2. Install Docker and Docker Compose:
   sudo apt update && sudo apt install -y docker.io docker-compose
   sudo usermod -aG docker $USER
3. Create a .env file on EC2 with production environment variables (MONGODB_URI should point to MongoDB Atlas or other managed DB):
   PORT=4000
   NODE_ENV=production
   MONGODB_URI=... (use MongoDB Atlas)
   JWT_SECRET=secure_value
   AWS_REGION=ap-south-1
   AWS_S3_BUCKET=your-bucket
4. Copy docker-compose.prod.yml and nginx/nginx.conf to EC2 project directory (git clone or scp), then run:
   docker-compose -f docker-compose.prod.yml up -d --remove-orphans

ECR & IAM
- Create ECR repository (name: smartbuy-backend)
- Create IAM user or role with permissions: ecr:GetAuthorizationToken, ecr:BatchCheckLayerAvailability, ecr:GetDownloadUrlForLayer, ecr:BatchGetImage, ecr:PutImage, ecr:InitiateLayerUpload, ecr:UploadLayerPart, ecr:CompleteLayerUpload, ecr:CreateRepository
- Add AWS credentials to GitHub Secrets

TLS / Domain
- For production, run Nginx on EC2 and configure Certbot (Let's Encrypt) to obtain TLS certs. Or set up CloudFront/ALB with ACM certs in front of EC2.

Rollback
- Each push tags the image with the git sha. To rollback, ssh to EC2 and docker pull <registry>/<repo>:<old-tag> and update docker-compose to use that tag or docker run the specific tag.

Notes
- The provided GitHub Actions deploys via SSH using appleboy/ssh-action. Ensure the EC2_SSH_KEY secret contains the PRIVATE key content and EC2 has the corresponding public key in authorized_keys.
- For higher-availability, use ECS/Fargate or EKS and a proper CI/CD pipeline with health checks and multi-AZ deployments.

Troubleshooting
- If docker-compose fails to pull image, confirm ECR registry and IAM permissions are correct.
- Check GitHub Actions logs for build/push errors.
- Check EC2 /var/log/syslog and Docker logs for runtime errors.

