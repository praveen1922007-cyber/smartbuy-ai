#!/bin/bash
set -e

# Bootstrap script for Ubuntu EC2 to run SmartBuy AI with Docker Compose and Nginx
# Usage: run as ubuntu user with sudo privileges

echo "Updating packages..."
sudo apt-get update -y

echo "Installing Docker and Docker Compose..."
sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo \"deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable\" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update -y
sudo apt-get install -y docker-ce docker-ce-cli containerd.io

# Install docker-compose plugin
sudo apt-get install -y docker-compose-plugin

# Add ubuntu user to docker group
sudo usermod -aG docker $USER || true

# Install Certbot for TLS (Nginx plugin)
sudo apt-get install -y certbot python3-certbot-nginx

# Create application directory
APP_DIR=/opt/smartbuy
sudo mkdir -p $APP_DIR
sudo chown $USER:$USER $APP_DIR
cd $APP_DIR

# Create placeholder docker-compose.prod.yml if not exists
if [ ! -f docker-compose.prod.yml ]; then
  cat > docker-compose.prod.yml <<'YAML'
version: '3.8'
services:
  backend:
    image: ${ECR_REGISTRY}/${ECR_REPOSITORY}:latest
    environment:
      - NODE_ENV=production
      - PORT=4000
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - AWS_REGION=${AWS_REGION}
      - AWS_S3_BUCKET=${AWS_S3_BUCKET}
    restart: always
    ports:
      - '4000:4000'

  nginx:
    image: nginx:1.25-alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./frontend:/usr/share/nginx/html:ro
    depends_on:
      - backend
    restart: always
YAML
fi

# Create simple systemd service to run docker compose
SERVICE_FILE=/etc/systemd/system/smartbuy.service
sudo tee $SERVICE_FILE > /dev/null <<'SERVICE'
[Unit]
Description=SmartBuy AI docker-compose
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/smartbuy
ExecStart=/usr/bin/docker compose -f docker-compose.prod.yml up -d --remove-orphans
ExecStop=/usr/bin/docker compose -f docker-compose.prod.yml down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
SERVICE

sudo systemctl daemon-reload
sudo systemctl enable smartbuy.service

echo "EC2 bootstrap complete. You can now place .env, nginx config, and docker-compose.prod.yml in $APP_DIR and start the service with: sudo systemctl start smartbuy.service"
