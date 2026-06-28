# Import Engine Architecture

## Philosophy
TimeCapsule will eventually ingest data from multiple disparate sources (Wikidata, TMDB, Wikipedia, manual editors, etc.). To manage this chaos, we treat the database as the sole source of truth and carefully screen all incoming data through the Import Engine.

## The Pipeline
1. **Validation & Typing (`types.ts`)**: Raw inputs are forced into standard normalized DTOs (`NormalizedEntity`, `NormalizedRelation`).
2. **Import Logger (`import-logger.ts`)**: Every import immediately creates an `ImportBatch` and links `RawImportRecord` rows for auditability.
3. **Entity Matcher (`entity-matcher.ts`)**: The system looks up an existing entity by `slug` or `title`.
4. **Idempotency & Conflict Resolution (`import-runner.ts`)**:
   - If the entity doesn't exist, it is created.
   - If it exists and the incoming data has non-destructive additions, it is safely updated.
   - If there is a destructive conflict (e.g., rewriting an existing description), it **skips the update** and pushes a `ReviewQueueItem` to the database for human/admin review.
5. **Relationships (`import-runner.ts`)**: Standardizes entity linking, ensuring we don't duplicate `EntityRelation` objects if they already exist.

## Running Manual Imports
We use a JSON-based local importer for curated data drops (e.g., `data/import/manual/1998-sample.json`).
Command:
```bash
npm run import:manual -- data/import/manual/1998-sample.json
```
