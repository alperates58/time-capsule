# Coolify Deployment Guide (Docker Compose)

TimeCapsule is fully prepared to be deployed as a single application stack via Docker Compose. This simplifies the infrastructure setup by spinning up the Next.js Web App and the PostgreSQL database simultaneously, linked through a private Docker network.

## 1. Application Creation in Coolify
1. Go to your Coolify dashboard and click **Add New Resource**.
2. Select **Docker Compose**.
3. Connect your repository (`alperates58/timecapsule`).
4. Coolify will automatically detect `docker-compose.yml` at the root.

## 2. Environment Variables
In the Coolify project settings under "Environment Variables", configure the following keys:
- `NODE_ENV=production`
- `NEXT_PUBLIC_SITE_URL=https://timecapsule.alperates.com.tr`
- `POSTGRES_USER=timecapsule_admin` *(Set to a secure username)*
- `POSTGRES_PASSWORD=your_secure_password_here` *(Set to a strong password)*
- `POSTGRES_DB=timecapsule`

*Note: You do not need to manually type the `DATABASE_URL`. It is dynamically constructed within `docker-compose.yml` using the variables above.*

## 3. Database Security & Persistence
- The PostgreSQL database runs securely inside the Docker network. The `ports: - "5432:5432"` mapping is completely removed so the database **cannot** be accessed externally.
- Data persistence is guaranteed by the `postgres_data` Docker volume. If the container restarts, the data is safe.
- The web app will wait for the database to become healthy (via `pg_isready`) before starting, preventing early crash loops.

## 4. Domain and Cloudflare DNS
1. In Coolify, under the `web` service settings, set the Domain to `https://timecapsule.alperates.com.tr`.
2. Go to Cloudflare and add an **A Record** or **CNAME** pointing `timecapsule` to your Coolify server's public IP.
3. Keep Cloudflare proxy status to "DNS Only" (grey cloud) during the first deployment to allow Let's Encrypt to verify the certificate.

## 5. First Deploy Verification (Smoke Testing)
Once the deployment indicator turns green, verify the following endpoints in your browser:
- `https://timecapsule.alperates.com.tr/` -> Should load the dynamic homepage.
- `https://timecapsule.alperates.com.tr/1998` -> Should load the 1998 profile.
- `https://timecapsule.alperates.com.tr/api/health` -> Should return `{"status":"ok", "database":"connected", ...}`
- `https://timecapsule.alperates.com.tr/admin/imports` -> Should load the dashboard. **WARNING: Do not expose this route publicly long term without adding Auth.**

## 6. Database Initialization (Post-Deploy)
Because we are using a brand new database volume, the schema must be pushed. Execute the following commands in the Coolify Terminal for the `web` container:

```bash
# Push the Prisma schema to the database safely
npx prisma db push

# Seed initial categories and relations
npm run prisma:seed
```

**WARNING**: 
- **DO NOT** run bulk imports without a dry-run first.
- Always test imports with: `npx tsx scripts/import-years.ts --year 1998 --types films --limit 5 --dry-run`

## 7. Redeploy Behavior
Coolify automatically redeploys upon pushing to the `main` branch. The multi-stage `Dockerfile` caches dependencies, and Docker Compose handles zero-downtime recreation while keeping the database volume untouched.
