#!/bin/bash
# Перенос правок из публичного снимка обратно в рабочую копию.
#
# Сценарий: внешний агент прислал патчи или архив, мы применили их к снимку
# ~/Desktop/ecoconcept/site-public, посмотрели — и переносим сюда.
#
# Что НЕ переносится:
#   .env.local              — ключи и закупочные цены живут только здесь
#   DEPLOY_BRIEF_FOR_CLAUDE — в снимке его нет, затирать нечем
#   review/                 — материалы аудита, они только в снимке
#   node_modules, .next     — сборка
#
# Обратите внимание: без --delete. Файл, удалённый в снимке, здесь останется —
# удаляйте руками осознанно, чтобы чужая правка не снесла лишнего.
set -e
DST="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$HOME/Desktop/ecoconcept/site-public"

rsync -a \
  --exclude ".git" --exclude "node_modules" --exclude ".next" \
  --exclude ".env" --exclude ".env.*" \
  --exclude "review" --exclude "*.log" --exclude ".DS_Store" \
  "$SRC/" "$DST/"

echo "перенесено. дальше:"
echo "  npx tsc --noEmit"
echo "  npm run build"
echo "  git -C \"$DST\" status --short   # посмотреть, что изменилось"
