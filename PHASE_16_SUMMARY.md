# Phase 16 Summary: Source Abstraction Layer

## Objectives Completed
- Implemented the `ImportSourceProvider` abstraction, ensuring that TimeCapsule's ingestion engine is fully decoupled from external APIs.
- Created the `ProviderRegistry` pattern, allowing the Bulk Import Orchestrator to dynamically discover and use sources.
- Successfully refactored `wikidata-importer.ts` into `WikidataProvider`, keeping all previous functionality intact without breaking CLI behavior.
- Added Stubs for future expansions (TMDB, MusicBrainz, OpenLibrary, IGDB, NASA).

## Key Features
- **Plug-and-Play Architecture**: Adding a new API is as simple as creating a class that implements `ImportSourceProvider` and adding one line to `provider-registry.ts`.
- **Intelligent Routing**: Scripts no longer call `importFromWikidata` directly. They ask the Registry: "Give me providers that support 'films'".
- **Trust & Rate Limit Metadata**: Each provider enforces its own trust level and rate limits, protecting the TimeCapsule database from API bans and low-quality data.

## Safety Constraints
- **Stubs Only**: The newly added providers (TMDB, MusicBrainz, etc.) are strictly stubs. If called, they safely throw an error. No unauthorized web requests are made.
- **Dry-Run Integrity**: The `--dry-run` behavior from Phase 15 functions identically through the new Provider interface.

## Next Steps
With the Provider architecture active, TimeCapsule can now be easily configured to connect to robust domain-specific APIs (e.g., fetching high-quality movie posters from TMDB or accurate game data from IGDB) to enrich the Year Profiles.
