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

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""

