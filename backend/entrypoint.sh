#!/bin/sh
set -e

# Run Prisma migrations and seed (idempotent) then start the app
if [ -n "$DATABASE_URL" ]; then
  echo "Running Prisma migrations..."
  npx prisma migrate deploy || true
  echo "Running seed..."
  npm run seed || true
else
  echo "DATABASE_URL not set - skipping migrations/seed during build. Will run at runtime if provided."
fi

# Start the server
npm start
