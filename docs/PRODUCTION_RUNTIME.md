# TimeCapsule Production Runtime Guide

## Architecture
TimeCapsule is packaged as a standalone Next.js application using Docker. This ensures environment parity between local development and production deployments (such as Coolify).

## Prisma Configuration & `libssl`
Starting from Phase 17, the application uses `node:20-bookworm-slim` (Debian 12) instead of Alpine. 
This was specifically chosen because Prisma's native C/C++ query engine requires `libssl.so.1.1` or robust OpenSSL 3.0 support. Alpine's `musl` combined with newer Node versions drops this compatibility by default, leading to CLI crashes.

## Environment Variables
Ensure the following variables are securely injected into your runtime:
- `DATABASE_URL`: Essential for Prisma. Must use PostgreSQL connection string. 
  Example: `postgresql://user:pass@host:5432/timecapsule?schema=public`
- `NEXT_PUBLIC_SITE_URL`: Used for canonical URLs and absolute links.
- `NODE_ENV`: Should be `production`.

## Coolify / PaaS Deployment
1. Point your deployment platform to the provided `Dockerfile`.
2. Connect a PostgreSQL database.
3. Configure the health check to ping `/api/health`.

## Health Check Endpoint
- **URL**: `GET /api/health`
- **Behavior**: Returns `200 OK` if the app is running and the database connection is healthy. Returns `503 Service Unavailable` if the database is unreachable.
- **Security**: Returns only `status`, `timestamp`, and boolean-like connectivity states. No connection strings or table data are exposed.

## Running CLI Scripts in Production Container
You can safely run the Bulk Importer orchestrator or other scripts within the running container without breaking the web server:
```bash
docker exec -it <container_id> npx tsx scripts/import-years.ts --year 1998 --types films --limit 5 --dry-run
```
*(Make sure `DATABASE_URL` is set in the container's environment so Prisma can connect to the production database.)*
