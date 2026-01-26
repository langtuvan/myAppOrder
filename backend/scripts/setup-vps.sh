#!/bin/bash

# VPS Server Setup Script for NestJS Backend
# Run this script on your VPS to prepare it for deployments

set -e

echo "=========================================="
echo "VPS Setup for NestJS Backend Deployment"
echo "=========================================="

# Update system
echo "==> Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install essential packages
echo "==> Installing essential packages..."
sudo apt-get install -y curl wget git build-essential

# Install Node.js 20.x
echo "==> Installing Node.js 20.x..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    echo "Node.js already installed: $(node -v)"
fi

# Install pnpm
echo "==> Installing pnpm..."
if ! command -v pnpm &> /dev/null; then
    npm install -g pnpm
else
    echo "pnpm already installed: $(pnpm -v)"
fi

# Install PM2
echo "==> Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    pm2 startup
    echo "NOTE: Run the command above to enable PM2 on system boot"
else
    echo "PM2 already installed: $(pm2 -v)"
fi

# Install MongoDB
echo "==> Installing MongoDB..."
if ! command -v mongod &> /dev/null; then
    wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
    sudo apt-get update
    sudo apt-get install -y mongodb-org
    
    # Start MongoDB
    sudo systemctl start mongod
    sudo systemctl enable mongod
    
    echo "MongoDB installed and started"
else
    echo "MongoDB already installed"
fi

# Install Nginx
echo "==> Installing Nginx..."
if ! command -v nginx &> /dev/null; then
    sudo apt-get install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
else
    echo "Nginx already installed"
fi

# Setup UFW Firewall
echo "==> Configuring UFW firewall..."
sudo apt-get install -y ufw
sudo ufw --force enable
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw status

# Install Certbot for SSL
echo "==> Installing Certbot for SSL certificates..."
sudo apt-get install -y certbot python3-certbot-nginx

# Create application directories
echo "==> Creating application directories..."
mkdir -p ~/apps/booking-api/{shared,releases,backups}
mkdir -p ~/apps/booking-api/shared/logs

echo "==> Creating Nginx configuration for backend..."
sudo tee /etc/nginx/sites-available/booking-api << 'EOF'
# Production environment
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /socket.io {
        proxy_pass http://localhost:5000/socket.io;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

# Enable Nginx site
sudo ln -sf /etc/nginx/sites-available/booking-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Configure MongoDB authentication:"
echo "   - mongo"
echo "   - use admin"
echo "   - db.createUser({user: 'adminuser', pwd: 'strongpassword', roles: ['root']})"
echo ""
echo "2. Update Nginx domains in /etc/nginx/sites-available/booking-api"
echo ""
echo "3. Set up SSL certificates:"
echo "   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com"
echo ""
echo "4. Add GitHub Actions secrets in your repository:"
echo "   - VPS_HOST: Your VPS IP or domain"
echo "   - VPS_USERNAME: Your SSH username"
echo "   - VPS_SSH_KEY: Your private SSH key"
echo "   - VPS_PORT: SSH port (default: 22)"
echo "   - MONGODB_URI: MongoDB connection string"
echo "   - JWT_SECRET: Your JWT secret"
echo "   - CORS_ORIGIN: Allowed CORS origins"
echo "   - PORT: Application port (default: 5000)"
echo "   - COOKIE_SECRET: Cookie secret (optional)"
echo ""
echo "5. Create SSH key for deployment (if not exists):"
echo "   ssh-keygen -t ed25519 -C 'github-actions-deploy'"
echo "   cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys"
echo "   cat ~/.ssh/id_ed25519  # Add this to GitHub secrets as VPS_SSH_KEY"
echo ""
echo "6. Enable PM2 startup:"
echo "   Run the command shown above after PM2 installation"
echo ""
