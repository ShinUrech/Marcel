#!/bin/bash
# ============================================================
# Marcel — Hetzner Cloud Deployment Script
# Deploys the full stack to a Hetzner CX22 VPS (2 vCPU, 4GB RAM)
# ============================================================
# Usage:
#   1. Set your Hetzner API token:  export HCLOUD_TOKEN="your-token"
#   2. Run:  bash deploy/setup-server.sh
# ============================================================

set -e

# ─── Configuration ───────────────────────────────────────────
SERVER_NAME="marcel-web"
SERVER_TYPE="cx22"           # 2 vCPU, 4GB RAM, 40GB SSD — €4.35/mo
IMAGE="ubuntu-24.04"
LOCATION="nbg1"              # Nuremberg, Germany (closest to Switzerland)
SSH_KEY_NAME="marcel-deploy"
REPO_URL="https://github.com/Elyesbc22/marcel.git"

echo "═══════════════════════════════════════════════════════"
echo "  Marcel — Hetzner Cloud Deployment"
echo "═══════════════════════════════════════════════════════"

# ─── Check prerequisites ────────────────────────────────────
if ! command -v hcloud &> /dev/null; then
    echo "❌ hcloud CLI not found. Install: winget install hetznercloud.cli"
    exit 1
fi

if [ -z "$HCLOUD_TOKEN" ]; then
    echo "❌ HCLOUD_TOKEN not set."
    echo "   Get one from: https://console.hetzner.cloud → Security → API Tokens"
    echo "   Then run: export HCLOUD_TOKEN='your-token'"
    exit 1
fi

# ─── Create SSH key if needed ────────────────────────────────
SSH_KEY_PATH="$HOME/.ssh/marcel_hetzner"
if [ ! -f "$SSH_KEY_PATH" ]; then
    echo "🔑 Generating SSH key..."
    ssh-keygen -t ed25519 -f "$SSH_KEY_PATH" -N "" -C "marcel-deploy"
fi

# Upload SSH key to Hetzner (ignore if already exists)
echo "🔑 Uploading SSH key to Hetzner..."
hcloud ssh-key create --name "$SSH_KEY_NAME" --public-key-from-file "${SSH_KEY_PATH}.pub" 2>/dev/null || true

# ─── Create server ──────────────────────────────────────────
echo "🖥️  Creating server: $SERVER_NAME ($SERVER_TYPE in $LOCATION)..."
hcloud server create \
    --name "$SERVER_NAME" \
    --type "$SERVER_TYPE" \
    --image "$IMAGE" \
    --location "$LOCATION" \
    --ssh-key "$SSH_KEY_NAME" \
    --label project=marcel

# Get server IP
SERVER_IP=$(hcloud server ip "$SERVER_NAME")
echo "✅ Server created: $SERVER_IP"

# ─── Wait for server to be ready ────────────────────────────
echo "⏳ Waiting for server to boot..."
sleep 30

# ─── Setup server via SSH ────────────────────────────────────
echo "🔧 Installing Docker and deploying Marcel..."
ssh -o StrictHostKeyChecking=no -i "$SSH_KEY_PATH" root@"$SERVER_IP" << 'REMOTE_SCRIPT'

# Update system
apt-get update && apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh

# Install Docker Compose plugin
apt-get install -y docker-compose-plugin

# Install Git
apt-get install -y git

# Clone repo
cd /opt
git clone https://github.com/Elyesbc22/marcel.git
cd marcel

# Create .env from example
cp .env.example .env
echo ""
echo "⚠️  IMPORTANT: Edit /opt/marcel/.env with your actual values:"
echo "   - CHATGPT_API_KEY (required for content generation)"
echo "   - GMAIL_USER / GMAIL_APP_PASS (optional, for contact form)"
echo ""

# Configure firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw allow 5000/tcp
ufw --force enable

# Start the stack
cd /opt/marcel
docker compose up -d --build

echo ""
echo "✅ Marcel is now running!"
echo "   Frontend: http://$(hostname -I | awk '{print $1}'):3000"
echo "   Backend:  http://$(hostname -I | awk '{print $1}'):5000/api"

REMOTE_SCRIPT

echo ""
echo "═══════════════════════════════════════════════════════"
echo "  ✅ Deployment complete!"
echo "═══════════════════════════════════════════════════════"
echo ""
echo "  Server IP:  $SERVER_IP"
echo "  Frontend:   http://$SERVER_IP:3000"
echo "  Backend:    http://$SERVER_IP:5000/api"
echo ""
echo "  SSH access: ssh -i $SSH_KEY_PATH root@$SERVER_IP"
echo ""
echo "  Next steps:"
echo "  1. SSH into server: ssh -i $SSH_KEY_PATH root@$SERVER_IP"
echo "  2. Edit env:  nano /opt/marcel/.env"
echo "  3. Restart:   cd /opt/marcel && docker compose up -d"
echo "  4. Trigger first scrape: curl http://$SERVER_IP:5000/api/scraper/scrape-all"
echo ""
echo "  To add a domain, point DNS to $SERVER_IP and set up Nginx:"
echo "  apt install nginx && nano /etc/nginx/sites-available/marcel"
echo "═══════════════════════════════════════════════════════"
