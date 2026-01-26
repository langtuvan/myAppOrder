#!/bin/bash

# Manual deployment script for VPS
# Usage: ./deploy-manual.sh

set -e

echo "=========================================="
echo "Manual Deployment to Production"
echo "=========================================="

# Load environment configuration
if [ -f ".env.production" ]; then
    source ".env.production"
else
    echo "Error: .env.production file not found"
    exit 1
fi

# Build the application
echo "==> Building application..."
pnpm install
pnpm run build

# Create deployment package
echo "==> Creating deployment package..."
DEPLOY_DIR="deploy-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$DEPLOY_DIR"

cp -r dist "$DEPLOY_DIR/"
cp package.json pnpm-lock.yaml ecosystem.config.js healthcheck.js "$DEPLOY_DIR/"

tar -czf "${DEPLOY_DIR}.tar.gz" "$DEPLOY_DIR"
rm -rf "$DEPLOY_DIR"

echo "==> Deployment package created: ${DEPLOY_DIR}.tar.gz"

# Upload to VPS
echo "==> Uploading to VPS..."
scp -P "${VPS_PORT:-22}" "${DEPLOY_DIR}.tar.gz" "${VPS_USERNAME}@${VPS_HOST}:/tmp/"

# Deploy on VPS
echo "==> Deploying on VPS..."
ssh -p "${VPS_PORT:-22}" "${VPS_USERNAME}@${VPS_HOST}" << ENDSSH
    set -e
    
    APP_NAME="booking-api"
    APP_DIR="\$HOME/apps/\${APP_NAME}"
    SHARED_DIR="\${APP_DIR}/shared"
    CURRENT_DIR="\${APP_DIR}/current"
    RELEASES_DIR="\${APP_DIR}/releases"
    RELEASE_DIR="\${RELEASES_DIR}/\$(date +%Y%m%d-%H%M%S)"
    BACKUP_DIR="\${APP_DIR}/backups"
    
    echo "==> Extracting deployment package..."
    mkdir -p "\${RELEASE_DIR}"
    cd /tmp
    tar -xzf "${DEPLOY_DIR}.tar.gz"
    mv "${DEPLOY_DIR}"/* "\${RELEASE_DIR}/"
    rm -rf "${DEPLOY_DIR}" "${DEPLOY_DIR}.tar.gz"
    
    echo "==> Creating symlinks..."
    ln -sfn "\${SHARED_DIR}/.env" "\${RELEASE_DIR}/.env"
    ln -sfn "\${SHARED_DIR}/logs" "\${RELEASE_DIR}/logs"
    
    echo "==> Installing dependencies..."
    cd "\${RELEASE_DIR}"
    pnpm install --prod --frozen-lockfile
    
    echo "==> Backing up current release..."
    if [ -L "\${CURRENT_DIR}" ]; then
        BACKUP_NAME="backup-\$(date +%Y%m%d-%H%M%S)"
        cp -r "\$(readlink \${CURRENT_DIR})" "\${BACKUP_DIR}/\${BACKUP_NAME}"
        echo "Backup created: \${BACKUP_NAME}"
        
        # Keep only last 5 backups
        cd "\${BACKUP_DIR}"
        ls -t | tail -n +6 | xargs -r rm -rf
    fi
    
    echo "==> Switching to new release..."
    ln -sfn "\${RELEASE_DIR}" "\${CURRENT_DIR}"
    
    echo "==> Restarting application..."
    cd "\${CURRENT_DIR}"
    
    if pm2 describe "\${APP_NAME}" > /dev/null 2>&1; then
        pm2 reload ecosystem.config.js --env production --update-env
    else
        pm2 start ecosystem.config.js --env production --name "\${APP_NAME}"
    fi
    
    pm2 save
    
    echo "==> Cleaning up old releases..."
    cd "\${RELEASES_DIR}"
    ls -t | tail -n +6 | xargs -r rm -rf
    
    echo "==> Deployment completed successfully!"
    pm2 list
ENDSSH

echo ""
echo "=========================================="
echo "Deployment Complete!"
echo "=========================================="

# Cleanup local deployment package
rm -f "${DEPLOY_DIR}.tar.gz"

echo "Check logs with: ssh ${VPS_USERNAME}@${VPS_HOST} 'pm2 logs booking-api'"
