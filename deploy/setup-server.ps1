# ============================================================
# Marcel — Hetzner Cloud Deployment (PowerShell)
# Deploys the full stack to a Hetzner CX22 VPS
# ============================================================
# Usage:
#   1. Set token:  $env:HCLOUD_TOKEN = "your-token"
#   2. Run:  .\deploy\setup-server.ps1
# ============================================================

$ErrorActionPreference = "Stop"

# ─── Configuration ───────────────────────────────────────────
$ServerName    = "marcel-web"
$ServerType    = "cx22"          # 2 vCPU, 4GB RAM, 40GB SSD — €4.35/mo
$Image         = "ubuntu-24.04"
$Location      = "nbg1"         # Nuremberg (closest to Switzerland)
$SshKeyName    = "marcel-deploy"
$RepoUrl       = "https://github.com/Elyesbc22/marcel.git"

Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  Marcel — Hetzner Cloud Deployment" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan

# ─── Check prerequisites ────────────────────────────────────
if (-not (Get-Command hcloud -ErrorAction SilentlyContinue)) {
    Write-Host "X hcloud CLI not found. Install: winget install hetznercloud.cli" -ForegroundColor Red
    exit 1
}

if (-not $env:HCLOUD_TOKEN) {
    Write-Host "X HCLOUD_TOKEN not set." -ForegroundColor Red
    Write-Host "  Get one from: https://console.hetzner.cloud -> Security -> API Tokens"
    Write-Host '  Then run: $env:HCLOUD_TOKEN = "your-token"'
    exit 1
}

# ─── Create SSH key if needed ────────────────────────────────
$SshKeyPath = "$env:USERPROFILE\.ssh\marcel_hetzner"
if (-not (Test-Path $SshKeyPath)) {
    Write-Host "Generating SSH key..." -ForegroundColor Yellow
    ssh-keygen -t ed25519 -f $SshKeyPath -N "" -C "marcel-deploy"
}

# Upload SSH key to Hetzner
Write-Host "Uploading SSH key to Hetzner..." -ForegroundColor Yellow
hcloud ssh-key create --name $SshKeyName --public-key-from-file "${SshKeyPath}.pub" 2>$null
# Ignore error if already exists

# ─── Create server ──────────────────────────────────────────
Write-Host "Creating server: $ServerName ($ServerType in $Location)..." -ForegroundColor Yellow
hcloud server create `
    --name $ServerName `
    --type $ServerType `
    --image $Image `
    --location $Location `
    --ssh-key $SshKeyName `
    --label project=marcel

$ServerIP = (hcloud server ip $ServerName).Trim()
Write-Host "Server created: $ServerIP" -ForegroundColor Green

# ─── Wait for server to be ready ────────────────────────────
Write-Host "Waiting for server to boot (30s)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# ─── Setup server via SSH ────────────────────────────────────
Write-Host "Installing Docker and deploying Marcel..." -ForegroundColor Yellow

$SetupScript = @'
set -e

# Update system
apt-get update && apt-get upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh

# Install Docker Compose plugin
apt-get install -y docker-compose-plugin git

# Clone repo
cd /opt
git clone https://github.com/Elyesbc22/marcel.git
cd marcel

# Create .env from example
cp .env.example .env

# Configure firewall
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw allow 5000/tcp
ufw --force enable

# Start the stack
docker compose up -d --build

echo "Done! Marcel is running."
'@

$SetupScript | ssh -o StrictHostKeyChecking=no -i $SshKeyPath root@$ServerIP "bash -s"

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "  Deployment complete!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "  Server IP:  $ServerIP"
Write-Host "  Frontend:   http://${ServerIP}:3000"
Write-Host "  Backend:    http://${ServerIP}:5000/api"
Write-Host ""
Write-Host "  SSH access: ssh -i $SshKeyPath root@$ServerIP"
Write-Host ""
Write-Host "  Next steps:" -ForegroundColor Yellow
Write-Host "  1. SSH in:   ssh -i $SshKeyPath root@$ServerIP"
Write-Host "  2. Edit env: nano /opt/marcel/.env"
Write-Host "  3. Add your CHATGPT_API_KEY, GMAIL_USER, GMAIL_APP_PASS"
Write-Host "  4. Restart:  cd /opt/marcel && docker compose up -d"
Write-Host "  5. Scrape:   curl http://${ServerIP}:5000/api/scraper/scrape-all"
Write-Host ""
