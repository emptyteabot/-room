#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/opt/focus-room}"
ENV_FILE="${ENV_FILE:-$APP_DIR/.env}"

read -r -s -p "CLOUDFLARE_API_TOKEN: " CLOUDFLARE_API_TOKEN
printf '\n'
read -r -p "CLOUDFLARE_ACCOUNT_ID: " CLOUDFLARE_ACCOUNT_ID
read -r -p "REMOTE_BACKUP_URL: " REMOTE_BACKUP_URL
read -r -p "NEXT_PUBLIC_SITE_URL: " NEXT_PUBLIC_SITE_URL

mkdir -p "$APP_DIR/data/backups"
touch "$ENV_FILE"

set_env_value() {
  local key="$1"
  local value="$2"
  local escaped
  escaped="$(printf '%s' "$value" | sed 's/[\/&]/\\&/g')"

  if grep -q "^$key=" "$ENV_FILE"; then
    sed -i "s/^$key=.*/$key=$escaped/" "$ENV_FILE"
  else
    printf '%s=%s\n' "$key" "$value" >> "$ENV_FILE"
  fi
}

set_env_value "CLOUDFLARE_API_TOKEN" "$CLOUDFLARE_API_TOKEN"
set_env_value "CLOUDFLARE_ACCOUNT_ID" "$CLOUDFLARE_ACCOUNT_ID"
set_env_value "FOCUS_ROOM_BACKUP_WEBHOOK_URL" "$REMOTE_BACKUP_URL"
set_env_value "FOCUS_ROOM_LEDGER_PATH" "$APP_DIR/data/vip-ledger.json"
set_env_value "NEXT_PUBLIC_SITE_URL" "$NEXT_PUBLIC_SITE_URL"

cd "$APP_DIR"
export CLOUDFLARE_API_TOKEN
export CLOUDFLARE_ACCOUNT_ID
npx wrangler deploy --config wrangler.toml
pm2 restart focus-room --update-env
python3 "$APP_DIR/scripts/backup_ledger.py"
