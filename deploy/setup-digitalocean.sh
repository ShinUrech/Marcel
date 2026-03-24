#!/bin/bash
# Deploy Marcel backend to a fresh DigitalOcean Droplet (Ubuntu 22.04)
# Run this from your LOCAL machine:
#   bash deploy/setup-digitalocean.sh <DROPLET_IP>
#
# Prerequisites:
#   - SSH access to the droplet (root or sudo user)
#   - .env file with MONGO_URI pointing to MongoDB Atlas

set -e

DROPLET_IP="${1:?Usage: $0 <DROPLET_IP>}"
SSH_USER="root"
REMOTE_DIR="/opt/marcel"

echo "==> Deploying to $DROPLET_IP..."

# ── 1. Install Docker on the droplet ──────────────────────────────────────────
echo "==> Installing Docker..."
ssh "$SSH_USER@$DROPLET_IP" bash << 'REMOTE'
set -e
if ! command -v docker &>/dev/null; then
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
fi
docker --version
REMOTE

# ── 2. Copy project files to droplet ──────────────────────────────────────────
echo "==> Syncing project files..."
ssh "$SSH_USER@$DROPLET_IP" "mkdir -p $REMOTE_DIR"

rsync -az --delete \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.env' \
  --exclude='puppeteer_data' \
  --exclude='*.sqlite' \
  "$(dirname "$0")/../" "$SSH_USER@$DROPLET_IP:$REMOTE_DIR/"

# ── 3. Copy .env ───────────────────────────────────────────────────────────────
echo "==> Copying .env..."
scp "$(dirname "$0")/../.env" "$SSH_USER@$DROPLET_IP:$REMOTE_DIR/.env"

# ── 4. Start containers ────────────────────────────────────────────────────────
echo "==> Starting containers..."
ssh "$SSH_USER@$DROPLET_IP" bash << REMOTE
set -e
cd $REMOTE_DIR
docker compose -f docker-compose.prod.yml down --remove-orphans 2>/dev/null || true
docker compose -f docker-compose.prod.yml up -d --build
echo ""
echo "==> Container status:"
docker compose -f docker-compose.prod.yml ps
REMOTE

echo ""
echo "✅ Done! Backend is running at http://$DROPLET_IP:5000/api"
echo ""
echo "Next steps:"
echo "  1. Deploy frontend to Vercel (see deploy/vercel-env-vars.txt)"
echo "  2. Set NEXT_PUBLIC_SERVER_URL=http://$DROPLET_IP:5000/api in Vercel"
echo "  3. Optionally set up a domain + nginx reverse proxy"
