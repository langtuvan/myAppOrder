# Backend Deployment - Quick Guide

Simple CI/CD setup for deploying NestJS backend to VPS.

## 🚀 Quick Setup (3 Steps)

### 1. Setup VPS

```bash
# Copy and run setup script on your VPS
scp backend/scripts/setup-vps.sh user@your-vps:/tmp/
ssh user@your-vps
chmod +x /tmp/setup-vps.sh
/tmp/setup-vps.sh
```

### 2. Configure GitHub Secrets

Go to: **Repository → Settings → Secrets → Actions**

Add these secrets 1:

- `VPS_HOST` - Your VPS IP (e.g., 123.456.789.0)
- `VPS_USERNAME` - SSH username (e.g., ubuntu)
- `VPS_SSH_KEY` - Private SSH key (generate on VPS)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Run: `openssl rand -base64 32`
- `CORS_ORIGIN` - Frontend URLs (e.g., https://yourdomain.com)

**Optional:**

- `VPS_PORT` - SSH port (default: 22)
- `PORT` - App port (default: 5000)
- `COOKIE_SECRET` - Run: `openssl rand -base64 32`

### 3. Deploy

Push to main branch:

```bash
git push origin main
```

Or trigger manually in GitHub Actions.

## 📁 Directory Structure on VPS

```
~/apps/booking-api/
├── current → releases/20260125-143022/
├── releases/
│   └── 20260125-143022/
├── backups/
└── shared/
    ├── .env
    └── logs/
```

## 🔑 Generate SSH Key (on VPS)

```bash
ssh-keygen -t ed25519 -C "github-deploy"
cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/id_ed25519  # Copy to VPS_SSH_KEY secret
```

## 🗄️ Configure MongoDB

```bash
mongosh
use admin
db.createUser({
  user: "booking_user",
  pwd: "strong_password",
  roles: [{ role: "readWrite", db: "booking" }]
})
```

MongoDB URI:

```
mongodb://booking_user:strong_password@localhost:27017/booking?authSource=admin
```

## 🌐 Setup Domain (Nginx)

1. Update domain in `/etc/nginx/sites-available/booking-api`
2. Get SSL certificate:

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## 📊 Monitor Application

```bash
# List apps
pm2 list

# View logs
pm2 logs booking-api

# Monitor
pm2 monit

# Restart
pm2 restart booking-api
```

## ⏮️ Rollback

On VPS:

```bash
cd ~/apps/booking-api
ls -lt releases/  # Find previous release
ln -sfn releases/PREVIOUS_TIMESTAMP current
cd current
pm2 reload ecosystem.config.js --env production --update-env
```

Or use script:

```bash
./backend/scripts/rollback.sh
```

## 🔧 Manual Deployment

```bash
cd backend
cp .env.production.example .env.production
# Edit .env.production with your values
chmod +x scripts/deploy-manual.sh
./scripts/deploy-manual.sh
```

## 🛠️ Troubleshooting

**Deployment fails?**

```bash
# Check GitHub Actions logs
# Test SSH: ssh -i key user@host
# Check disk: df -h
# MongoDB status: sudo systemctl status mongod
```

**App won't start?**

```bash
pm2 logs booking-api --lines 100
cat ~/apps/booking-api/shared/.env
mongosh "your-mongodb-uri"
```

**Nginx issues?**

```bash
sudo nginx -t
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

## 🔐 Security Checklist

- ✅ Disable SSH password auth
- ✅ Enable UFW firewall (22, 80, 443 only)
- ✅ Use strong MongoDB passwords
- ✅ Keep system updated: `sudo apt update && sudo apt upgrade`
- ✅ Enable MongoDB authentication
- ✅ Setup SSL with Certbot

## 📦 Automatic Backups

Create `~/backup-mongodb.sh`:

```bash
#!/bin/bash
BACKUP_DIR="$HOME/backups/mongodb"
DATE=$(date +%Y%m%d-%H%M%S)
mkdir -p "$BACKUP_DIR"

mongodump --uri="your-mongodb-uri" --out="$BACKUP_DIR/$DATE"
tar -czf "$BACKUP_DIR/$DATE.tar.gz" "$BACKUP_DIR/$DATE"
rm -rf "$BACKUP_DIR/$DATE"

# Keep last 7 days
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete
```

Add to cron:

```bash
chmod +x ~/backup-mongodb.sh
crontab -e
# Add: 0 2 * * * /home/user/backup-mongodb.sh
```

## 📚 Full Documentation

See [CI-CD-SETUP.md](./CI-CD-SETUP.md) for detailed documentation.

## 🎯 Workflow

```
Push to main → GitHub Actions → Test → Build → Deploy to VPS → PM2 Reload → ✅
```

Zero downtime deployments with automatic rollback capability!
