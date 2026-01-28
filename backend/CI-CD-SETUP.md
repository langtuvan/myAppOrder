# CI/CD Setup Guide

Automated deployment pipeline for NestJS backend to VPS using GitHub Actions, PM2, and Nginx.

## Prerequisites

- VPS with Ubuntu 20.04+
- GitHub repository
- Domain name (optional, for SSL)

## Initial VPS Setup


Connection string:

```
mongodb://booking_user:PASSWORD@localhost:27017/booking-staging?authSource=admin
```

### 3. Generate SSH Key

```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/github_deploy
cat ~/.ssh/github_deploy.pub >> ~/.ssh/authorized_keys
cat ~/.ssh/github_deploy  # Copy for GitHub
```

### 4. Configure Nginx

```bash
sudo nano /etc/nginx/sites-available/booking-api
# Update with your domains
sudo nginx -t
sudo systemctl reload nginx
```

```

### 6. Enable PM2 Auto-start

```bash
pm2 startup
# Run the generated command
pm2 save
```

## GitHub Configuration

Navigate to: **Repository → Settings → Secrets and variables → Actions**

### Required Secrets

| Secret         | Description        | Example                                        |
| -------------- | ------------------ | ---------------------------------------------- |
| `VPS_HOST`     | VPS IP or domain   | `123.456.789.0`                                |
| `VPS_USERNAME` | SSH username       | `ubuntu`                                       |
| `VPS_SSH_KEY`  | Private SSH key    | Contents of `~/.ssh/github_deploy`             |
| `MONGODB_URI`  | MongoDB connection | `mongodb://user:pass@localhost:27017/db`       |
| `JWT_SECRET`   | JWT signing key    | Generate: `openssl rand -base64 32`            |
| `CORS_ORIGIN`  | Allowed origins    | `https://yourdomain.com;http://localhost:3000` |

### Optional Secrets

| Secret          | Default | Description           |
| --------------- | ------- | --------------------- |
| `VPS_PORT`      | `22`    | SSH port              |
| `PORT`          | `5000`  | Application port      |
| `COOKIE_SECRET` | -       | Session cookie secret |

### Environment-Specific Configuration

**Staging:**

```env
MONGODB_URI=mongodb://user:pass@localhost:27017/booking-staging?authSource=admin
PORT=5000
CORS_ORIGIN=http://localhost:3000;https://staging.yourdomain.com
```

**Production:**

```env
MONGODB_URI=mongodb://user:pass@localhost:27017/booking-production?authSource=admin
PORT=5001
CORS_ORIGIN=https://yourdomain.com;https://www.yourdomain.com
```

## Deployment

### Automatic Deployment

- **Staging:** Push to `staging` branch
- **Production:** Push to `main` branch

```bash
git push origin staging    # Deploy to staging
git push origin main       # Deploy to production
```

### Manual Deployment via GitHub

1. Go to **Actions → Deploy Backend to VPS**
2. Click **Run workflow**
3. Select environment
4. Click **Run workflow**

### Manual Deployment via Script

```bash
cd backend
cp .env.staging.example .env.staging
cp .env.production.example .env.production
# Edit environment files
chmod +x scripts/deploy-manual.sh
./scripts/deploy-manual.sh staging
```

## Release Structure

```
~/apps/booking-api-production/
├── current → releases/20260125-143022/
├── releases/
│   ├── 20260125-143022/
│   ├── 20260125-120000/
│   └── ...
├── backups/
│   └── backup-20260125-143022/
└── shared/
    ├── .env
    └── logs/
```

## Rollback

### Via SSH

```bash
ssh user@your-vps
cd ~/apps/booking-api-production
ls -lt releases/  # List releases
ln -sfn releases/PREVIOUS_TIMESTAMP current
cd current
pm2 reload ecosystem.config.js --env production --update-env
```

### Via Script

```bash
cd backend
chmod +x scripts/rollback.sh
./scripts/rollback.sh production
```

## Monitoring

### PM2 Commands

```bash
pm2 list                              # List processes
pm2 logs booking-api-production       # View logs
pm2 monit                             # Monitor resources
pm2 restart booking-api-production    # Restart app
pm2 stop booking-api-production       # Stop app
```

### Application Logs

```bash
tail -f ~/apps/booking-api-production/shared/logs/out.log
tail -f ~/apps/booking-api-production/shared/logs/err.log
```

### Nginx Logs

```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## Troubleshooting

### Deployment Fails

```bash
# Check GitHub Actions logs
# Verify SSH: ssh -i key user@host
df -h  # Check disk space
sudo systemctl status mongod  # Check MongoDB
```

### Application Won't Start

```bash
pm2 logs booking-api-production --lines 100
cat ~/apps/booking-api-production/shared/.env
mongosh "mongodb://user:pass@localhost:27017/db?authSource=admin"
cd ~/apps/booking-api-production/current
pm2 start ecosystem.config.js --env production
```

### Nginx Issues

```bash
sudo nginx -t  # Test configuration
sudo systemctl status nginx
sudo systemctl restart nginx
sudo tail -f /var/log/nginx/error.log
```

## Backup Strategy

### Automated MongoDB Backups

Create `~/backup-mongodb.sh`:

```bash
#!/bin/bash
BACKUP_DIR="$HOME/backups/mongodb"
DATE=$(date +%Y%m%d-%H%M%S)
mkdir -p "$BACKUP_DIR"

# Backup databases
mongodump --uri="mongodb://user:pass@localhost:27017/booking-staging?authSource=admin" \
  --out="$BACKUP_DIR/staging-$DATE"
mongodump --uri="mongodb://user:pass@localhost:27017/booking-production?authSource=admin" \
  --out="$BACKUP_DIR/production-$DATE"

# Compress
tar -czf "$BACKUP_DIR/staging-$DATE.tar.gz" "$BACKUP_DIR/staging-$DATE"
tar -czf "$BACKUP_DIR/production-$DATE.tar.gz" "$BACKUP_DIR/production-$DATE"
rm -rf "$BACKUP_DIR/staging-$DATE" "$BACKUP_DIR/production-$DATE"

# Keep last 7 days
find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete
```

Setup cron job:

```bash
chmod +x ~/backup-mongodb.sh
crontab -e
# Add: 0 2 * * * /home/user/backup-mongodb.sh >> /home/user/backup.log 2>&1
```

## Security Hardening

### SSH Configuration

```bash
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
sudo systemctl restart sshd
```

### Firewall

```bash
sudo ufw status  # Only 22, 80, 443 should be open
```

### System Updates

```bash
sudo apt update && sudo apt upgrade -y
```

### MongoDB Security

- Enable authentication ✓
- Use strong passwords ✓
- Bind to localhost only ✓
- Regular backups ✓

## Deployment Workflow

```mermaid
graph TD
    A[Push to GitHub] --> B[GitHub Actions]
    B --> C[Run Tests & Build]
    C --> D[Deploy to VPS]
    D --> E[Create Release]
    E --> F[Install Dependencies]
    F --> G[Backup Current]
    G --> H[Switch Symlink]
    H --> I[PM2 Reload]
    I --> J[Health Check]
```

## Best Practices

- ✅ Test in staging before production
- ✅ Monitor logs after deployment
- ✅ Never commit `.env` files
- ✅ Automate database backups
- ✅ Use health checks to verify deployments
- ✅ Keep last 5 releases for rollback
- ✅ Regular security updates

## Environment Reference

| Environment | Port | Database             | Domain                   |
| ----------- | ---- | -------------------- | ------------------------ |
| Staging     | 5000 | `booking-staging`    | `staging.yourdomain.com` |
| Production  | 5001 | `booking-production` | `yourdomain.com`         |

## Related Documentation

- [DEPLOYMENT.md](./DEPLOYMENT.md) - General deployment guide
- [README.md](./README.md) - Application documentation
- [ecosystem.config.js](./ecosystem.config.js) - PM2 configuration
