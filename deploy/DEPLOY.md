# Marcel — Deployment Checklist

## Architecture
- **Frontend** → Vercel (free)
- **Backend + Cron** → DigitalOcean Droplet ($6/mo, paid with credits)
- **Database** → MongoDB Atlas (free 512MB)
- **LinkedIn scraping** → Local machine only (manual)

---

## Step 1 — MongoDB Atlas

- [ ] Create account at [cloud.mongodb.com](https://cloud.mongodb.com)
- [ ] Create a free cluster (M0, any region)
- [ ] **Security → Database Access** → Add New Database User
  - Auth: Password
  - Username: `marcel`
  - Password: autogenerate and copy it
  - Role: Read and write to any database
- [ ] **Security → Network Access** → Add IP Address → Allow from Anywhere (`0.0.0.0/0`)
- [ ] **Database → Connect** → Drivers → copy connection string
- [ ] Update `.env`:
  ```
  MONGO_URI=mongodb+srv://marcel:<password>@cluster0.xxxxx.mongodb.net/practicedb?retryWrites=true&w=majority
  ```

---

## Step 2 — DigitalOcean Droplet

- [ ] Create Droplet at [cloud.digitalocean.com](https://cloud.digitalocean.com)
  - OS: Ubuntu 22.04 LTS
  - Plan: Basic — $6/mo (1 vCPU, 1GB RAM)
  - Authentication: SSH Key (add your public key)
- [ ] Copy the Droplet IP
- [ ] Make deploy script executable and run it:
  ```bash
  chmod +x deploy/setup-digitalocean.sh
  bash deploy/setup-digitalocean.sh <DROPLET_IP>
  ```
- [ ] Verify backend is up: `http://<DROPLET_IP>:5000/api`

---

## Step 3 — Vercel (Frontend)

- [ ] Go to [vercel.com](https://vercel.com) → New Project → Import `Elyesbc22/marcel`
- [ ] Set **Root Directory** to `project-marcel-fe`
- [ ] Add Environment Variables in Vercel dashboard (Project → Settings → Environment Variables):

  | Key | Value |
  |-----|-------|
  | `NEXT_PUBLIC_SERVER_URL` | `http://<DROPLET_IP>:5000/api` |
  | `NEXT_PUBLIC_SERVER_FILE_HOST` | `http://<DROPLET_IP>:5000/api/articles/show/` |
  | `NODE_ENV` | `production` |
  | `APP_NAME` | `IRISO Bau AG` |
  | `APP_EMAIL` | `info@irisobau.ch` |
  | `GMAIL_USER` | your Gmail address |
  | `GMAIL_APP_PASS` | your Gmail app password |

- [ ] Deploy
- [ ] Verify frontend is live at your Vercel URL

---

## Step 4 — LinkedIn Scraping (Local, manual)

LinkedIn scraping is **excluded from the server's auto-cron**. Run it locally whenever needed:

```bash
# Make sure your local backend is running and MONGO_URI points to Atlas
curl http://localhost:5000/api/scraper/linkedin/sbb-cff-ffs
curl http://localhost:5000/api/scraper/linkedin/bls-ag
```

Articles are written directly to MongoDB Atlas and appear on the live site immediately.

---

## Notes

- The server auto-cron runs daily at 03:00 UTC (all sources except LinkedIn)
- Weekly content/teaser generation runs every Sunday at 06:00 UTC
- To redeploy after a code change: `bash deploy/setup-digitalocean.sh <DROPLET_IP>`
