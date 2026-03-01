# Marcel — Swiss Rail News Aggregator

A full-stack web application that aggregates Swiss rail industry news, YouTube videos, and LinkedIn posts for **IRISO Bau AG**. Built with NestJS (backend), Next.js (frontend), MongoDB, and Puppeteer-based scrapers.

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌───────────┐
│  Frontend   │────▶│   Backend    │────▶│  MongoDB  │
│  Next.js    │:3000│   NestJS     │:5000│           │:27017
└─────────────┘     └──────┬───────┘     └───────────┘
                           │
                    ┌──────┴───────┐
                    │  Puppeteer   │  35+ rail source scrapers
                    │  Chromium    │  OpenAI content generation
                    └──────────────┘
```

| Service | Tech | Port |
|---------|------|------|
| Frontend | Next.js 16, React 19, Tailwind CSS | 3000 |
| Backend | NestJS 10, Mongoose, Puppeteer, OpenAI | 5000 |
| Database | MongoDB 7 | 27017 |
| Scraper Cron | curl-based scheduler | — |

---

## Quick Start (Docker — Recommended)

### Prerequisites

- [Docker Engine](https://docs.docker.com/engine/install/) ≥ 24.0
- [Docker Compose](https://docs.docker.com/compose/install/) ≥ 2.20
- At least **4 GB RAM** available (Puppeteer + Chromium needs memory)

### 1. Clone the repo

```bash
git clone https://github.com/Elyesbc22/marcel.git
cd marcel
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your actual values:

| Variable | Required | Description |
|----------|----------|-------------|
| `CHATGPT_API_KEY` | Yes | OpenAI API key for content generation |
| `GMAIL_USER` | Optional | Gmail address for the contact form |
| `GMAIL_APP_PASS` | Optional | Gmail app password (not regular password) |
| `CONTACT_RECEIVER` | Optional | Email address that receives contact form messages |

### 3. Build and start

```bash
docker compose up -d --build
```

This starts 4 services:
- **mongo** — MongoDB 7 with seed data (12 sample articles)
- **backend** — NestJS API on port 5000
- **frontend** — Next.js on port 3000
- **scraper-cron** — Automated scraping (daily 03:00) and content generation (weekly Sunday 06:00)

### 4. Access the application

| Service | URL |
|---------|-----|
| Website | http://localhost:3000 |
| API | http://localhost:5000/api |
| MongoDB | mongodb://localhost:27017/practicedb |

### 5. Expose to your network

The docker-compose already binds to `0.0.0.0`, so the app is accessible from other machines on your network using the host machine's IP:

```bash
# Find your IP
# Linux/Mac:
hostname -I
# Windows:
ipconfig
```

Then access from any device on the network:
- `http://<HOST_IP>:3000` — Website
- `http://<HOST_IP>:5000/api` — API

#### Firewall rules (if needed)

```bash
# Linux (ufw)
sudo ufw allow 3000/tcp
sudo ufw allow 5000/tcp

# Windows (PowerShell as Admin)
New-NetFirewallRule -DisplayName "Marcel Frontend" -Direction Inbound -Port 3000 -Protocol TCP -Action Allow
New-NetFirewallRule -DisplayName "Marcel Backend" -Direction Inbound -Port 5000 -Protocol TCP -Action Allow
```

#### Custom domain / reverse proxy (Nginx)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:5000/api;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Manual Scraping

Trigger a full scrape of all 32 rail sources:

```bash
curl http://localhost:5000/api/scraper/scrape-all
```

Or scrape individual sources:

```bash
# YouTube channels
curl http://localhost:5000/api/scraper/youtube/sbbcffffs
curl http://localhost:5000/api/scraper/youtube/BLSBahn
curl http://localhost:5000/api/scraper/youtube/stadlerrailgroup

# LinkedIn
curl http://localhost:5000/api/scraper/linkedin/sbb-cff-ffs
curl http://localhost:5000/api/scraper/linkedin/bls-ag

# Format dates after scraping
curl http://localhost:5000/api/scraper/formateDates
```

---

## LinkedIn Scraping — Session Setup

LinkedIn scraping requires a **persistent browser session** (cookies + local storage). This must be set up once locally and then synced to the server. LinkedIn does not allow automated login without triggering CAPTCHAs.

### Step 1 — Log in locally (one-time setup, repeat when session expires)

Run the manual login script on your **local machine** (requires a display):

```bash
cd project-marcel-be
npx ts-node manual-login.ts
```

A Chromium browser will open. Log in to LinkedIn, complete any CAPTCHAs, wait until you see your feed, then **close the browser**. The session is saved to `puppeteer_data/linkedin/`.

### Step 2 — Deploy to server

```bash
# Sync the session files to your server
rsync -avz ./puppeteer_data/ user@your-server:/path/to/marcel/puppeteer_data/
```

Docker automatically mounts this directory into the backend container via:
```yaml
volumes:
  - ./puppeteer_data:/app/puppeteer_data
```

### Step 3 — Restart backend

```bash
docker-compose restart backend
```

### When the session expires

LinkedIn sessions typically last several weeks. When scraping starts returning 0 articles or login errors, repeat Steps 1 & 2.

> ⚠️ **Never commit `puppeteer_data/`** — it contains your personal LinkedIn session. It is already in `.gitignore`.

---

## Local Development (without Docker)

### Prerequisites

- Node.js ≥ 18.12
- MongoDB running locally on port 27017

### Backend

```bash
cd project-marcel-be
npm install
# Configure .env.development (already has defaults)
npm run start:dev
```

### Frontend

```bash
cd project-marcel-fe
npm install
# Configure .env.local (already has defaults)
npm run dev
```

---

## Project Structure

```
marcel/
├── docker-compose.yml          # Full stack orchestration
├── .env.example                # Environment template
├── mongo-init/
│   └── seed.js                 # Initial sample data
├── project-marcel-be/          # NestJS Backend
│   ├── Dockerfile
│   ├── src/
│   │   ├── modules/
│   │   │   ├── scraper/        # 35+ Puppeteer scrapers
│   │   │   ├── articles/       # CRUD + search + images
│   │   │   └── content-generator/ # OpenAI integration
│   │   ├── common/             # Helpers, utils, filters
│   │   └── models/             # Mongoose schemas
│   └── public/                 # Downloaded images
├── project-marcel-fe/          # Next.js Frontend
│   ├── Dockerfile
│   ├── app/                    # Pages (App Router)
│   ├── components/             # React components
│   ├── locales/                # i18n (German)
│   └── lib/                    # Env config, utils
```

## Useful Commands

```bash
# Start all services
docker compose up -d --build

# View logs
docker compose logs -f backend
docker compose logs -f frontend

# Stop all services
docker compose down

# Stop and remove volumes (reset database)
docker compose down -v

# Rebuild a single service
docker compose up -d --build backend
```

---

## Rail Sources (32 scrapers)

SBB, BLS, SOB, Stadler Rail, Alstom, Rhomberg Sersa, Implenia, Bernmobil, SEV Online, ProAlps, Baublatt, Bahnblogstelle, SBB Cargo, Müller Frauenfeld, Marti Group, RhB, Regionalverkehr Bern-Solothurn, and more.

## License

Private — IRISO Bau AG
