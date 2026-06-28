# Coolify Deployment Guide

This document outlines the steps required to deploy TimeCapsule to Coolify, utilizing our production-hardened Dockerfile and PostgreSQL stack.

## 1. Application Creation in Coolify
1. Go to your Coolify dashboard and click **Add New Resource**.
2. Select **Public Repository** (or Private if using GitHub App integration).
3. Connect your repository (`alperates58/timecapsule`).
4. Select **Docker** as the build pack/method. Coolify will automatically detect the `Dockerfile` at the root.
5. Set the Port to `3000`.

## 2. Environment Variables
In the Coolify project settings under "Environment Variables", configure:
- `NODE_ENV=production`
- `NEXT_PUBLIC_SITE_URL=https://timecapsule.alperates.com.tr`
- `DATABASE_URL` (Wait until step 3 to copy this)

## 3. PostgreSQL Service Setup
1. In the same Coolify environment, add a new **PostgreSQL** database service.
2. Coolify will generate a local internal URL (e.g., `postgresql://user:pass@coolify-db:5432/timecapsule`).
3. Copy this internal `DATABASE_URL` and paste it into the TimeCapsule application environment variables.

## 4. Domain and Cloudflare DNS
1. In Coolify, set the Domains field to `https://timecapsule.alperates.com.tr`.
2. Go to Cloudflare and add an **A Record** or **CNAME** pointing `timecapsule` to your Coolify server's public IP.
3. **SSL Expectations**: Coolify's Traefik/Caddy proxy will automatically provision a Let's Encrypt SSL certificate once DNS resolves. Keep Cloudflare proxy status to "DNS Only" (grey cloud) during the first deployment to allow Let's Encrypt verification.

## 5. First Deploy Verification (Smoke Testing)
Once the deployment indicator turns green, verify the following endpoints in your browser:
- `https://timecapsule.alperates.com.tr/` -> Should load the dynamic homepage.
- `https://timecapsule.alperates.com.tr/1998` -> Should load the 1998 profile.
- `https://timecapsule.alperates.com.tr/api/health` -> Should return `{"status":"ok", "database":"connected", ...}`
- `https://timecapsule.alperates.com.tr/admin/imports` -> Should load the dashboard. **WARNING: Do not expose this route publicly long term without adding Auth in upcoming phases.**

## 6. Database Initialization (Post-Deploy)
The database schema must be pushed on the first run. Connect to the Coolify server terminal (or use the web terminal for the container):

```bash
# Push schema safely
npx prisma db push

# Seed initial data (categories, initial 1998 entities)
npm run prisma:seed
```

**WARNING**: 
- **DO NOT** run bulk imports without a dry-run first.
- **DO NOT** run `import:years` without `--dry-run` unless you are prepared to wait and consume API quotas.
- Always test with: `npx tsx scripts/import-years.ts --year 1998 --types films --limit 5 --dry-run`

## 7. Redeploy Behavior
Coolify automatically redeploys upon pushing to the `main` branch. The `Dockerfile` multi-stage build securely caches dependencies, minimizing downtime. Next.js standalone optimization will handle the restart efficiently.
