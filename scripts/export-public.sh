#!/bin/bash
# Обновление публичного снимка сайта (репозиторий ecoconcept-site-review).
#
# Что исключается и почему:
#   .env, .env.local        — ключи и закупочные цены
#   DEPLOY_BRIEF_FOR_CLAUDE — деплой-бриф с боевыми данными
#   node_modules, .next     — сборка
#   review/                 — материалы аудита, живут только в снимке
#
# Использование: bash scripts/export-public.sh
set -e
SRC="$(cd "$(dirname "$0")/.." && pwd)"
DST="$HOME/Desktop/ecoconcept/site-public"

rsync -a --delete \
  --exclude ".git" --exclude "node_modules" --exclude ".next" \
  --exclude ".env" --exclude ".env.*" --exclude "!.env.example" \
  --exclude ".vercel" --exclude ".DS_Store" --exclude "*.log" \
  --exclude ".claude" --exclude ".agents" --exclude "media" \
  --exclude "*.tsbuildinfo" --exclude ".impeccable" \
  --exclude "DEPLOY_BRIEF_FOR_CLAUDE.md" --exclude "review" \
  "$SRC/" "$DST/"
cp "$SRC/.env.example" "$DST/.env.example"

FOUND=$(grep -rIn "rest/1/\|PURCHASE_PRICES=.\|ghp_\|postgres://" "$DST" \
  --exclude-dir=node_modules --exclude-dir=.git \
  --exclude=".env.example" --exclude="export-public.sh" || true)

if [ -n "$FOUND" ]; then
  echo "НАЙДЕНЫ СЕКРЕТЫ — не пушить:"
  echo "$FOUND" | head -5
  exit 1
fi
echo "секретов нет, снимок готов"
