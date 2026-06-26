# Phase 01 Verification Report

As part of the verification process, I manually reviewed all configurations to ensure they meet the absolute requirements for Phase 1 and are ready for Coolify deployment.

## What Was Checked & Fixed

- **[FIXED] `package.json` Scripts**: Added the missing `"format": "prettier --write ."` and `"prisma:generate": "prisma generate"` commands.
- **[FIXED] `.gitignore` Added**: A comprehensive `.gitignore` was added to ensure `.env` files, `node_modules`, and `.next` build outputs are strictly excluded from version control, maintaining repository security.
- **[FIXED] Dockerfile Resiliency**: Added a `public/.gitkeep` placeholder. The `Dockerfile` assumes the presence of a `public` directory when running `COPY --from=builder /app/public ./public`. Without this empty directory, Docker builds on Coolify would crash.
- **Next.js Standalone Build**: Verified `next.config.mjs` contains `output: "standalone"`. This is crucial for keeping Docker images minimal on Coolify.
- **`robots.ts` & `sitemap.ts`**: Verified they use the App Router standard of dynamically generating `.txt` and `.xml` equivalents using `MetadataRoute.Robots` and `MetadataRoute.Sitemap`.
- **shadcn/ui & Tailwind**: Verified `components.json`, `tailwind.config.ts`, `globals.css`, and `theme-provider.tsx` are correctly wired together for immediate use in Phase 2.
- **`.env.example`**: Verified it exists, is safe (only containing local Postgres URIs), and is completely separated from `.env`.

## What Could Not Be Checked

Because this environment does not currently have Node.js installed locally, I could not execute:
- `npm run lint`
- `npm run build`
- `npm run dev`

While I have manually verified the syntax of all configurations, it is highly recommended to run these locally before initiating a Coolify build.

## Commands You Must Run Locally

Before deploying, please open your terminal in the `time-capsule` directory and run:

```bash
# 1. Install all dependencies
npm install

# 2. Run formatting and linting
npm run format
npm run lint

# 3. Generate the Prisma Client
npm run prisma:generate

# 4. Run a local build to ensure standalone output generates without errors
npm run build

# 5. Start the local server to verify the UI
npm run start
```

## Coolify Deployment Settings

When setting up this project in Coolify for **Phase 2**, you will need to apply the following configurations:

- **Build Pack:** Nixpacks or Dockerfile. (Recommended: Select the **Dockerfile** option since we have provided a highly optimized multi-stage build script).
- **Start Command:** `node server.js`
- **Port:** `3000`
- **Environment Variables:**
  - `NODE_ENV=production`
  - `DATABASE_URL=postgresql://<user>:<password>@<coolify_postgres_host>:<port>/timecapsule?schema=public`

## Risks Before First Deploy

- **Prisma Schema Migration**: The `schema.prisma` is currently blank. Before connecting to a production Coolify Postgres instance, we will need to decide if migrations run during the build step or separately. Currently, `prisma generate` is called, but `prisma db push` or `prisma migrate deploy` is not. This is intentional for Phase 1 as the schema is empty, but must be addressed in later phases.
- **Environment Variables**: You must ensure `DATABASE_URL` is set inside Coolify, or the app might crash on boot if Prisma attempts to instantiate without a valid URL.
