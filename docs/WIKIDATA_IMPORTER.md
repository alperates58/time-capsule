# Wikidata Importer Architecture

## Concept
We implemented the first true external importer for TimeCapsule targeting Wikidata via SPARQL queries. To maintain a lightweight footprint, this importer uses the native `fetch()` API against `query.wikidata.org/sparql` instead of a bulky third-party client.

## Capabilities
We currently support extracting 4 distinct types of data for any given year:
1. **Events** (`--type events`): Notable occurrences and historical moments.
2. **Films** (`--type films`): Movies released in the target year.
3. **Births** (`--type births`): People born in the target year.
4. **Deaths** (`--type deaths`): People who died in the target year.

By default, the script limits the output to `20` records per run to ensure we don't accidentally flood the database during prototyping.

## How to Run
```bash
# General syntax
npm run import:wikidata -- --year <YYYY> --type <events|films|births|deaths> --limit <number>

# Example
npm run import:wikidata -- --year 1998 --type films --limit 10
```

## Safeguards & Idempotency
- **Strict Quality Control**: Entities fetched from Wikidata are skipped if they do not have an **English Label** and an **English Description**. 
- **External ID Matching**: Wikidata QIDs (e.g. `Q11424`) are stored as the `externalId` within a `SourceReference`. 
- **Idempotency**: Running the same command twice will not duplicate rows. The `entity-matcher` intercepts the attempt, sees no safe fields left to update, skips the destructive overwrite, and quietly finishes.

## Limitations
- Wikidata can rate-limit if queries are blasted too quickly.
- There is no automated cron job yet; imports are executed manually.
- We rely on the `Service wikibase:label` which can sometimes be slow.
