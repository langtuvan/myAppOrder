# CI/CD Setup Guide - Backend Deployment to VPS

Complete guide for setting up automated CI/CD pipeline to deploy the NestJS backend to your VPS hosting.

## 📋 Overview

This setup uses GitHub Actions to automatically:

- Run tests and linting
- Build the application
- Deploy to VPS using SSH
- Manage releases with rollback capability
- Zero-downtime deployments with PM2

## 🚀 Quick Start

### 1. Prepare Your VPS

SSH into your VPS and run the setup script:

```bash
# Copy the setup script to your VPS
scp backend/scripts/setup-vps.sh user@your-vps:/tmp/

# SSH into your VPS
ssh user@your-vps

# Run the setup script
chmod +x /tmp/setup-vps.sh
/tmp/setup-vps.sh
```

This will install:

- Node.js 20.x
- pnpm
- PM2
- MongoDB
- Nginx
- Certbot (for SSL)
- UFW Firewall

### 2. Configure MongoDB

Create a database user for your application:

```bash
mongosh

use admin
db.createUser({
  user: "booking_user",
  pwd: "your_strong_password_here",
  roles: [
    { role: "readWrite", db: "booking-staging" },
    { role: "readWrite", db: "booking-production" }
  ]
})
```

Your MongoDB URI will be:

```
mongodb://booking_user:your_strong_password_here@localhost:27017/booking-staging?authSource=admin
```

### 3. Setup SSH Key for GitHub Actions

On your VPS:

```bash
# Generate SSH key for deployments
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy

# Add public key to authorized_keys
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys

# Display private key (copy this for GitHub secrets)
cat ~/.ssh/github_deploy
```

### 4. Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions → New repository secret

Add the following secrets:

#### Required Secrets:

- `VPS_HOST` - Your VPS IP address or domain
- `VPS_USERNAME` - SSH username
- `VPS_SSH_KEY` - Private SSH key (from step 3)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - JWT secret key (generate with: `openssl rand -base64 32`)
- `CORS_ORIGIN` - Allowed CORS origins (semicolon-separated)

#### Optional Secrets:

- `VPS_PORT` - SSH port (default: 22)
- `PORT` - Application port (default: 5000)
- `COOKIE_SECRET` - Cookie secret (generate with: `openssl rand -base64 32`)

#### Environment-Specific Secrets:

For staging:

```
MONGODB_URI=mongodb://user:pass@localhost:27017/booking-staging?authSource=admin
PORT=5000
CORS_ORIGIN=http://localhost:3000;https://staging.yourdomain.com
```

For production:

```
MONGODB_URI=mongodb://user:pass@localhost:27017/booking-production?authSource=admin
PORT=5001
CORS_ORIGIN=https://yourdomain.com;https://www.yourdomain.com
```

### 5. Configure Nginx

Update the Nginx configuration with your domains:

```bash
sudo nano /etc/nginx/sites-available/booking-api
```

Replace `yourdomain.com` with your actual domain.

Test and reload Nginx:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Setup SSL Certificates

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d staging.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### 7. Enable PM2 Startup

```bash
pm2 startup
# Run the command that PM2 outputs
pm2 save
```

## 🔄 Deployment Workflows

### Automatic Deployments

**Staging:** Push to `staging` branch

```bash
git push origin staging
```

**Production:** Push to `main` branch

```bash
git push origin main
```

### Manual Deployments

Trigger deployment from GitHub:

1. Go to Actions → Deploy Backend to VPS
2. Click "Run workflow"
3. Select environment (staging/production)
4. Click "Run workflow"

### Local Manual Deployment

```bash
cd backend

# Create environment files
cp .env.staging.example .env.staging
cp .env.production.example .env.production

# Edit with your values
nano .env.staging
nano .env.production

# Deploy
chmod +x scripts/deploy-manual.sh
./scripts/deploy-manual.sh staging
```

## ⏮️ Rollback

If something goes wrong, rollback to the previous release:

### From VPS:

```bash
ssh user@your-vps

# View releases
ls -lt ~/apps/booking-api-production/releases/

# Rollback
cd ~/apps/booking-api-production
ln -sfn releases/PREVIOUS_RELEASE_TIMESTAMP current
cd current
pm2 reload ecosystem.config.js --env production --update-env
```

### Using Rollback Script:

```bash
cd backend
chmod +x scripts/rollback.sh
./scripts/rollback.sh production
```

## 📊 Monitoring & Logs

### PM2 Commands:

```bash
# List all processes
pm2 list

# View logs
pm2 logs booking-api-production
pm2 logs booking-api-staging

# Monitor
pm2 monit

# Restart
pm2 restart booking-api-production

# Stop
pm2 stop booking-api-production
```

### Application Logs:

```bash
# On VPS
tail -f ~/apps/booking-api-production/shared/logs/out.log
tail -f ~/apps/booking-api-production/shared/logs/err.log
```

### Nginx Logs:

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🔧 Troubleshooting

### Deployment Fails

1. Check GitHub Actions logs
2. Verify SSH connection: `ssh -i path/to/key user@host`
3. Check VPS disk space: `df -h`
4. Verify MongoDB is running: `sudo systemctl status mongod`

### Application Won't Start

```bash
# Check PM2 logs
pm2 logs booking-api-production --lines 100

# Check environment variables
cat ~/apps/booking-api-production/shared/.env

# Test MongoDB connection
mongosh "mongodb://user:pass@localhost:27017/booking-production?authSource=admin"

# Manually start
cd ~/apps/booking-api-production/current
pm2 start ecosystem.config.js --env production
```

### Nginx Issues

```bash
# Test configuration
sudo nginx -t

# Check status
sudo systemctl status nginx

# Restart
sudo systemctl restart nginx

# Check logs
sudo tail -f /var/log/nginx/error.log
```

## 🔐 Security Best Practices

1. **SSH Hardening:**

   ```bash
   # Disable password authentication
   sudo nano /etc/ssh/sshd_config
   # Set: PasswordAuthentication no
   sudo systemctl restart sshd
   ```

2. **MongoDB Security:**
   - Enable authentication
   - Use strong passwords
   - Bind to localhost only
   - Regular backups

3. **Firewall:**

   ```bash
   sudo ufw status
   # Only ports 22, 80, 443 should be open
   ```

4. **Regular Updates:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

## 📦 Backup Strategy

### Automatic Backups (Recommended)

Create a backup script:

```bash
#!/bin/bash
# ~/backup-mongodb.sh

BACKUP_DIR="$HOME/backups/mongodb"
DATE=$(date +%Y%m%d-%H%M%S)

mkdir -p "$BACKUP_DIR"

# Backup staging
mongodump --uri="mongodb://user:pass@localhost:27017/booking-staging?authSource=admin" \
  --out="$BACKUP_DIR/staging-$DATE"

# Backup production
mongodump --uri="mongodb://user:pass@localhost:27017/booking-production?authSource=admin" \
  --out="$BACKUP_DIR/production-$DATE"

# Compress
tar -czf "$BACKUP_DIR/staging-$DATE.tar.gz" "$BACKUP_DIR/staging-$DATE"
tar -czf "$BACKUP_DIR/production-$DATE.tar.gz" "$BACKUP_DIR/production-$DATE"

# Cleanup
rm -rf "$BACKUP_DIR/staging-$DATE" "$BACKUP_DIR/production-$DATE"

# Keep only last 7 days
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

Setup cron job:

```bash
chmod +x ~/backup-mongodb.sh
crontab -e

# Add: Daily backup at 2 AM
0 2 * * * /home/user/backup-mongodb.sh >> /home/user/backup.log 2>&1
```

## 🎯 Release Management

The CI/CD pipeline maintains:

- Last 5 releases on the VPS
- Last 5 backups
- Automatic cleanup of old releases

### Directory Structure:

```
~/apps/booking-api-production/
├── current -> releases/20260125-143022/
├── releases/
│   ├── 20260125-143022/
│   ├── 20260125-120000/
│   └── ...
├── backups/
│   ├── backup-20260125-143022/
│   └── ...
└── shared/
    ├── .env
    └── logs/
```

## 📝 Environment Variables Reference

### Staging Environment:

- Node: `NODE_ENV=staging`
- Port: `5000`
- MongoDB: `booking-staging` database
- Domain: `staging.yourdomain.com`

### Production Environment:

- Node: `NODE_ENV=production`
- Port: `5001`
- MongoDB: `booking-production` database
- Domain: `yourdomain.com`

## 🔄 Workflow Diagram

```
┌─────────────┐
│ Push Code   │
│ to GitHub   │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│ GitHub Actions      │
│ - Install deps      │
│ - Run tests         │
│ - Lint code         │
│ - Build app         │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Deploy to VPS       │
│ - Upload build      │
│ - Create release    │
│ - Install deps      │
│ - Backup current    │
│ - Switch symlink    │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ PM2 Reload          │
│ - Zero downtime     │
│ - Health check      │
└──────┬──────────────┘
       │
       ▼
┌─────────────────────┐
│ Deployment Complete │
└─────────────────────┘
```

## 💡 Tips

1. **Test in staging first** - Always deploy to staging before production
2. **Monitor after deployment** - Check logs and PM2 status after each deployment
3. **Keep secrets secure** - Never commit .env files to git
4. **Regular backups** - Automate database backups
5. **Health checks** - Use the healthcheck endpoint to verify deployments
6. **Gradual rollout** - For major changes, consider blue-green deployments

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section
2. Review GitHub Actions logs
3. Check PM2 and Nginx logs on the VPS
4. Verify all environment variables are set correctly

## 🔗 Related Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - General deployment guide
- [README.md](./README.md) - Application documentation
- [ecosystem.config.js](./ecosystem.config.js) - PM2 configuration
