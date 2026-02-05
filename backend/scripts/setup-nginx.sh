#!/bin/bash

# Nginx Setup Script for NestJS Backend
# Run this script to configure Nginx as reverse proxy

set -e

echo "=========================================="
echo "Nginx Configuration for NestJS Backend"
echo "=========================================="

# Install Nginx
echo "==> Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    sudo apt-get update
    sudo apt-get install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
else
    echo "Nginx already installed"
fi

# Setup UFW Firewall for web traffic
echo "==> Configuring firewall for HTTP/HTTPS..."
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw status

echo "==> Creating Nginx configuration for backend..."

sudo tee /etc/nginx/sites-available/booking-api.webnextapp.com.conf << 'EOF'
# Production environment
server {
        listen 443;
        listen [::]:443;
        ssl on;
        ssl_certificate /etc/ssl/booking-api/certificate.crt;
        ssl_certificate_key /etc/ssl/booking-api/private.key;
        server_name booking-api.webnextapp.com;

   location /  {
        proxy_pass http://localhost:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
   }

location /socket.io/ {
  proxy_pass http://localhost:5000;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "Upgrade";
  proxy_set_header Host $host;
}

EOF

# Enable Nginx site
sudo ln -sf /etc/nginx/sites-available/booking-api.webnextapp.com.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

echo ""
echo "=========================================="
echo "Nginx Setup Complete!"
echo "=========================================="
echo ""

