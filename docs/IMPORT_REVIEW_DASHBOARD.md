# Admin Import Review Dashboard

The Import Review Dashboard (`/admin/imports`) is the internal operations hub for TimeCapsule's ingestion engine.

## Overview
As TimeCapsule scales to accept data from dozens of sources (Wikidata, manual JSONs, TMDB, etc.), we need a central place to monitor the ingestion health, audit raw payloads, and manually resolve data conflicts. This dashboard fulfills that need in a strictly **read-only** mode for now.

## Layout & Components
The dashboard is split into three main tabs:
1. **Import Batches**: Shows an aggregated timeline of import runs. It lists the data source, start/end timestamps, and exactly how many entities/relations were created or failed.
2. **Raw Records**: Shows the exact, unprocessed JSON payloads we received from external sources. It maps `externalId` (like Wikidata QIDs) and allows developers to audit exactly what a source provided before normalization.
3. **Review Queue**: The conflict resolution center. If an external source attempts to destructively overwrite an existing, curated piece of data, the Import Engine catches it and creates a `PENDING` ReviewQueueItem. This tab displays the reason, confidence score, and proposed action.

## Security & SEO
- Currently, this route displays a bold warning indicating that authentication and role-based access control (RBAC) are pending.
- No destructive actions (Approve, Reject, Delete, Retry) are wired up. The buttons exist merely as UX placeholders.
- The route enforces `robots: { index: false, follow: false }` to ensure search engines never crawl internal data.

## Technical Details
- The route uses `force-dynamic` to ensure that Next.js does not statically cache the admin data.
- Payload previews are rendered using a custom `PayloadPreview` React component, which nicely formats JSON objects, includes a "Copy" button, and toggles to expand large payloads.
