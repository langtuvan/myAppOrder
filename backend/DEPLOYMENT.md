# Deployment (Ubuntu VPS)

Pragmatic steps to ship the NestJS booking backend to a VPS using PM2 + Nginx.

## Prereqs
- Ubuntu 20.04+ server with SSH.
- Node.js 18+/20+ and MongoDB available (see setup script below).
- GitHub repo access with Actions enabled.

## Server Prep (one-time)
1) SSH in: `ssh user@host`.
2) Install stack (Node, MongoDB, PM2, Nginx, UFW, Certbot) via your bootstrap script, or manually install if you prefer. Ensure MongoDB auth is enabled for prod.
3) Create an app home, e.g. `~/apps/booking-api-{env}/` with `shared` subfolder for `.env` and logs.



## Env Vars (minimal set)
- `PORT` (default 5000)
- `MONGODB_URI`
- `NODE_ENV` (`production`/`staging`)
- `JWT_SECRET`
- `CORS_ORIGIN` (semicolon-separated origins)
- Optional: `COOKIE_SECRET`, `JWT_EXPIRES_IN`, any mail/S3 keys you use.

## GitHub Actions Secrets
- SSH/host: `VPS_HOST`, `VPS_USERNAME`, `VPS_SSH_KEY`, optional `VPS_PORT`.
- App: `MONGODB_URI`, `JWT_SECRET`, `CORS_ORIGIN`, `PORT` (if not 5000).
- Notifications/coverage optional (e.g., `SLACK_WEBHOOK`, `CODECOV_TOKEN`).

## Deploy Flow
- Push to `main` → CI (lint/test/build) → CD job deploys to VPS (PM2 non-Docker).
- Manual: run the deploy workflow in Actions, choose `staging` or `production`.

## PM2 & Nginx
- App managed by PM2 with `ecosystem.config.js`; set `instances: "max"` for cluster mode if desired.
- Nginx proxies port 80/443 → app `PORT`; enable gzip and basic caching if needed.
- For TLS: `sudo certbot --nginx -d your-domain.com -d www.your-domain.com` and confirm `certbot renew --dry-run`.

## Health & Logs
- PM2: `pm2 status`, `pm2 logs booking-{env}`, `pm2 restart booking-{env}`.
- Nginx: `sudo nginx -t`, `sudo systemctl status nginx`, tails under `/var/log/nginx/`.
- MongoDB: `sudo systemctl status mongod`, logs under `/var/log/mongodb/`.

## Troubleshooting
- App won’t start: check PM2 logs; verify `.env` (Mongo URI, JWT_SECRET, PORT) and that Mongo is reachable.
- Permissions: ensure deploy user owns `~/apps/booking-api-{env}`.
- Actions failures: confirm secrets, SSH key format, and host reachability.

## Backups (lightweight)
- App bundles: keep a dated backup of previous release in `~/apps/booking-api-{env}/backup-YYYYMMDD-HHMMSS/` before replacing `current/`.
- Mongo: cron a `mongodump` nightly and prune older than 7 days.

## Hardening
- UFW allow 22/80/443; prefer SSH keys, disable password auth.
- Keep system/Node updated; renew TLS; monitor PM2/Nginx/Mongo logs and add alerts where possible.
