#!/bin/bash

# Rollback script for VPS deployment
# Usage: ./rollback.sh

set -e

# Load environment configuration
if [ -f ".env.production" ]; then
    source ".env.production"
else
    echo "Error: .env.production file not found"
    exit 1
fi

echo "=========================================="
echo "Rollback Deployment"
echo "=========================================="

ssh -p "${VPS_PORT:-22}" "${VPS_USERNAME}@${VPS_HOST}" << ENDSSH
    set -e
    
    APP_NAME="booking-api"
    APP_DIR="\$HOME/apps/\${APP_NAME}"
    CURRENT_DIR="\${APP_DIR}/current"
    RELEASES_DIR="\${APP_DIR}/releases"
    BACKUP_DIR="\${APP_DIR}/backups"
    
    # Get the previous release
    cd "\${RELEASES_DIR}"
    RELEASES=(\$(ls -t))
    
    if [ \${#RELEASES[@]} -lt 2 ]; then
        echo "Error: No previous release found to rollback to"
        exit 1
    fi
    
    PREVIOUS_RELEASE="\${RELEASES[1]}"
    
    echo "==> Current release: \${RELEASES[0]}"
    echo "==> Rolling back to: \${PREVIOUS_RELEASE}"
    
    read -p "Continue with rollback? (y/n) " -n 1 -r
    echo
    
    if [[ ! \$REPLY =~ ^[Yy]$ ]]; then
        echo "Rollback cancelled"
        exit 0
    fi
    
    echo "==> Switching to previous release..."
    ln -sfn "\${RELEASES_DIR}/\${PREVIOUS_RELEASE}" "\${CURRENT_DIR}"
    
    echo "==> Restarting application..."
    cd "\${CURRENT_DIR}"
    pm2 reload ecosystem.config.js --env production --update-env
    pm2 save
    
    echo "==> Rollback completed successfully!"
    pm2 list
    
    echo ""
    echo "Current release is now: \${PREVIOUS_RELEASE}"
ENDSSH

echo ""
echo "=========================================="
echo "Rollback Complete!"
echo "=========================================="
