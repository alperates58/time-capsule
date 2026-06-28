# Phase 12 Summary: Wikidata Importer Prototype

## Objectives Completed
- Demonstrated remote fetching capabilities by connecting TimeCapsule to the Wikidata SPARQL API.
- Implemented a lightweight, native `fetch`-based client (`client.ts`).
- Defined 4 curated SPARQL queries (`queries.ts`): Events, Films, Births, and Deaths.
- Created `normalizer.ts` to cleanly extract English labels and descriptions, discarding incomplete Wikidata nodes (e.g., nodes that only have a QID as a label).
- Integrated smoothly with the Phase 11 `runManualImport` core, saving the QID as an `externalId` and registering the payload in `RawImportRecord`.
- Developed `scripts/import-wikidata.ts` for simple, configurable execution.

## Limitations and Quality Controls
Because TimeCapsule values quality over quantity, the importer actively discards data that doesn't meet minimum standards (must have an English label and description). We also enforce a conservative default limit (20 records) to avoid unexpected surges in the database. 

## Idempotency Verification
The import logic was built around the existing Idempotency engine. When re-running the same `import:wikidata` command:
- The `fetch` calls Wikidata again and receives the same payloads.
- The `normalizer` adapts them.
- The `entity-matcher` realizes these slugs/QIDs already exist in the database.
- It bypasses destructive overwrites, doesn't duplicate the rows, and safely finishes with 0 new additions.

## Next Steps
The external import engine is officially proven. TimeCapsule is now capable of gathering the world's history securely. The next logical phase is likely expanding the API coverage (e.g., TMDB for rich posters, MusicBrainz for albums) or implementing the Admin UI to manage the `ReviewQueueItem` conflicts.
