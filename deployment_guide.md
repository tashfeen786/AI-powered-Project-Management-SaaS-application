# Production Deployment Guide (Phase 11)

This document provides a comprehensive walkthrough for deploying the AI-powered Project Management SaaS to a production environment. 

## 1. System Architecture

The production architecture consists of the following isolated, containerized services:
*   **Frontend**: Next.js 15 (React 19) server optimized for SSG/SSR.
*   **Backend API**: FastAPI (Uvicorn running ASGI with multiple workers).
*   **WebSockets**: ASGI endpoint mounted directly on FastAPI.
*   **Database**: Managed PostgreSQL instance (e.g., Supabase, AWS RDS, DigitalOcean).
*   **Message Broker & Cache**: Redis (Alpine Docker image).
*   **Background Workers**: Celery (Worker & Beat for scheduling asynchronous LLM agents).
*   **Reverse Proxy / API Gateway**: NGINX (handling HTTPS, Brotli/Gzip compression, static file caching, and rate limiting).
*   **SSL**: Certbot (Automated Let's Encrypt certificates).

---

## 2. Server Preparation

Provision an Ubuntu 22.04 LTS Linux server (e.g., AWS EC2, DigitalOcean Droplet, Hetzner) with at least 4GB RAM and 2 vCPUs.

### Install Dependencies
SSH into your server and run:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose git ufw
sudo systemctl enable --now docker
```

### Configure Firewall (UFW)
Only expose necessary ports.
```bash
sudo ufw allow OpenSSH
sudo ufw allow "Nginx Full" # Opens 80 and 443
sudo ufw enable
```

---

## 3. Environment Configuration

Clone your repository to the server:
```bash
git clone git@github.com:yourorg/ai-pm-saas.git /opt/ai-pm-saas
cd /opt/ai-pm-saas
```

Create the `.env.production` file based on the template provided in the repository:
```bash
cp .env.production.example .env.production
nano .env.production
```

**Critical Variables:**
*   `DATABASE_URL`: Ensure you use a production database. **Do not use SQLite in production.**
*   `SECRET_KEY`: Generate a secure 64-character hex string.
*   `GROQ_API_KEY`: Your paid Groq API key for autonomous agents.

---

## 4. Reverse Proxy & HTTPS (NGINX + Certbot)

The repository ships with an optimized `docker/nginx/nginx-prod.conf`.

### 1. Update Domain References
Before starting, ensure your DNS A-records for `yourdomain.com` and `www.yourdomain.com` point to your server's IP address.
Edit `nginx-prod.conf` and replace `yourdomain.com` with your actual domain name.

### 2. Initial SSL Certificate Generation
You must generate the initial certificate before NGINX can bind to port 443. Run this helper script (or run manually):
```bash
docker run -it --rm --name certbot \
  -v "$(pwd)/docker/nginx/certbot_conf:/etc/letsencrypt" \
  -v "$(pwd)/docker/nginx/certbot_www:/var/www/certbot" \
  certbot/certbot certonly \
  --standalone -d yourdomain.com -d www.yourdomain.com
```

### 3. Launch the Stack
```bash
docker-compose -f docker-compose.prod.yml up -d --build
```
NGINX will now automatically serve traffic over HTTPS (TLS 1.2/1.3) and force HTTP->HTTPS redirects. Certbot will run in the background to automatically renew certificates every 12 hours if they are near expiration.

---

## 5. Security & Performance Optimizations Applied

*   **Security Headers**: CSP (Content-Security-Policy), Strict-Transport-Security (HSTS), X-Frame-Options (Clickjacking protection), and X-XSS-Protection are strictly enforced in NGINX.
*   **Rate Limiting**: `api_limit` restricts traffic to the backend to 10 requests/second per IP to prevent DDoS or API abuse.
*   **Compression**: Gzip is enabled for `text/html`, `application/json`, `text/css`, and `application/javascript` to dramatically reduce TTFB (Time To First Byte).
*   **Static Asset Caching**: NGINX intercepts Next.js static assets and caches them with `max-age=2592000` (30 days).

---

## 6. Continuous Integration / Continuous Deployment (CI/CD)

The repository includes a GitHub Action `.github/workflows/deploy.yml`.

### Setup
1. Go to your GitHub Repository -> **Settings** -> **Secrets and variables** -> **Actions**.
2. Add the following Repository Secrets:
    *   `PROD_HOST`: Your server's IP address.
    *   `PROD_USER`: The SSH user (e.g., `ubuntu` or `root`).
    *   `PROD_SSH_KEY`: A private SSH key authorized to access the server.
    *   `DATABASE_URL`, `SECRET_KEY`, `GROQ_API_KEY`, `REDIS_URL`.

When you push to the `main` branch, the workflow will automatically SSH into the server, pull the latest code, inject the environment variables, rebuild the Docker containers without downtime (`up -d --build`), and apply any Alembic database migrations.

---

## 7. Database Backups

A backup script is located at `scripts/backup_db.sh`. It automatically compresses the Postgres database into a `gzip` file and purges backups older than 7 days.

To automate this, add it to your server's cron jobs:
```bash
crontab -e
```
Add the following line to run at 2:00 AM every day:
```cron
0 2 * * * /opt/ai-pm-saas/scripts/backup_db.sh >> /var/log/db_backup.log 2>&1
```

---

## 8. Monitoring & Maintenance

*   **View Logs**: `docker-compose -f docker-compose.prod.yml logs -f --tail=100`
*   **Access Database Shell**: `docker-compose -f docker-compose.prod.yml exec backend python -m app.db.cli`
*   **Celery Monitor (Flower)**: Available at `http://yourdomain.com:5555` (Ensure you secure this endpoint behind Basic Auth in NGINX or a VPN).

Your AI Agent SaaS platform is now production-ready!
