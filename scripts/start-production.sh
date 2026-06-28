#!/bin/sh
set -e

echo "[TimeCapsule] Starting production initialization sequence..."

if [ -z "$DATABASE_URL" ]; then
  echo "[TimeCapsule ERROR] DATABASE_URL is not set. Terminating."
  exit 1
fi

echo "[TimeCapsule] 1/3: Pushing database schema..."
# DO NOT use --accept-data-loss. If there is a destructive change, we want the container to crash loudly.
npx prisma db push --skip-generate

echo "[TimeCapsule] 2/3: Seeding database (idempotent)..."
npx tsx prisma/seed.ts

echo "[TimeCapsule] 3/3: Starting Next.js web server..."
exec node server.js
