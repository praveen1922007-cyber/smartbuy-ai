EC2 Setup for SmartBuy AI

This document provides exact commands to prepare an Ubuntu EC2 instance to host SmartBuy AI using Docker Compose and Nginx. It also explains how to install Certbot for TLS and how to run the app as a systemd service.

1) Launch an Ubuntu EC2 instance
- Ubuntu 22.04 LTS recommended
- Use a security group that allows:
  - SSH (port 22) from your IP
  - HTTP (port 80) from 0.0.0.0/0
  - HTTPS (port 443) from 0.0.0.0/0
  - App port 4000 (optional) if you want direct access (not required with Nginx)

2) Connect to the instance
ssh -i /path/to/key.pem ubuntu@EC2_PUBLIC_IP

3) Clone the repo and run the bootstrap script (or download and run)
sudo apt-get update -y
sudo apt-get install -y git
sudo git clone https://github.com/YOUR_ORG/YOUR_REPO.git /opt/smartbuy
cd /opt/smartbuy/backend

# Make the script executable and run it
chmod +x scripts/ec2/setup_ec2.sh
./scripts/ec2/setup_ec2.sh

4) Prepare environment and config files
- Create a .env file in /opt/smartbuy with production variables (MONGODB_URI should point to MongoDB Atlas):
  PORT=4000
  NODE_ENV=production
  MONGODB_URI=your_mongo_uri
  JWT_SECRET=your_jwt_secret
  AWS_REGION=ap-south-1
  AWS_S3_BUCKET=your_bucket

- Place nginx/nginx.conf in /opt/smartbuy/nginx/nginx.conf (the repo's nginx config should work but edit server_name and routes as required)

5) Deploy container and enable service
sudo systemctl start smartbuy.service
sudo systemctl status smartbuy.service

6) Obtaining TLS certificates with Certbot (if you manage DNS for your domain)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

Certbot will automatically update Nginx configuration and reload.

7) Frontend deployment
- Build frontend locally (or in CI) and upload dist/ or build/ files to /opt/smartbuy/frontend/ on the EC2 instance. Nginx will serve files from /usr/share/nginx/html inside the container which is mounted from ./frontend

scp -i /path/to/key.pem -r frontend/dist/* ubuntu@EC2_PUBLIC_IP:/opt/smartbuy/frontend/

Then reload the docker compose service:
sudo systemctl restart smartbuy.service

8) Logs and troubleshooting
- Docker logs:
  sudo docker compose -f /opt/smartbuy/docker-compose.prod.yml logs -f
- Systemd service logs:
  sudo journalctl -u smartbuy.service -f

9) Automation via GitHub Actions
- The repo includes a deploy-ec2 GitHub Actions workflow that SSHs to the EC2 instance and pulls the latest image from ECR and runs docker-compose. Ensure your repository secrets are configured as described in docs/deployment.md

Notes
- For production-grade deployments, consider using ECS/Fargate with ALB, RDS for relational data if needed, and CloudWatch for logs/metrics.
- Back up your .env and monitor certificate renewals (Certbot sets up automatic renewals by default).
