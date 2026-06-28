# Phase 20: Admin Import Runner

## Goal
Provide a secure UI within the Admin Dashboard to run bulk or single-year imports natively, executing internal functions without relying on child processes or shell commands.

## What Was Done
1. **API Route Orchestrator (`src/app/api/admin/imports/run/route.ts`)**:
   - Built a secure POST endpoint that hooks directly into `ProviderRegistry`.
   - Loops through requested years/types natively in Node.js instead of triggering `tsx` CLI shells.
   - Collects runtime statistics (success, skipped, failed) per batch and returns them securely.

2. **Middleware Protection (`src/middleware.ts`)**:
   - Expanded the JWT cookie auth matcher to cover `/api/admin/:path*`, ensuring malicious bots cannot trigger bulk operations externally.

3. **Import Runner UI (`src/app/admin/imports/run/page.tsx`)**:
   - Developed a responsive, dark-themed React form supporting "Single Year" and "Range" modes.
   - Enforced client-side and server-side safety limits: **Max 10 years range**, **Max 50 limit**.
   - Made `Dry Run` active by default. Triggering a real mutation pops up an explicit UI warning.
   - Prevents double submissions using React state management during orchestration.

4. **Dashboard Integration**:
   - Linked `/admin/imports/run` directly into the existing `import-dashboard.tsx` header for easy access.

## Verification
- Validated via `npm run lint`.
- Validated via `npm run build` locally.
- Successfully built via `docker compose build`.

## Next Steps
- Implement logic to handle AI-generated descriptions for the fetched Wikidata payloads.
- Prepare the architecture for connecting TMDB (movies/series) and IGDB (video games) data sources.
