# Bulk Year Import Orchestrator

The Bulk Year Import Orchestrator (`scripts/import-years.ts`) is a command-line utility for mass ingestion of historical data via TimeCapsule's integrated sources (like Wikidata). It is explicitly designed to be safe, defaulting to harmless dry-runs.

## Usage

```bash
npm run import:years -- [options]
```

### Options

| Argument | Description | Default |
|----------|-------------|---------|
| `--year` | Process a single specific year. | None |
| `--from` | Start year for a bulk range. Must be used with `--to`. | None |
| `--to` | End year for a bulk range. Must be used with `--from`. | None |
| `--types` | Comma-separated list of query templates (e.g. `events,films,births,deaths`). | `events,films,births,deaths` |
| `--limit` | Maximum number of results to fetch per year per type. | `10` |
| `--dry-run` | `true` or `false`. If `true`, queries Wikidata but makes zero DB writes. | `true` |
| `--delay-ms` | Milliseconds to wait between external API requests to prevent blocks. | `1000` |
| `--continue-on-error` | `true` or `false`. Skip to the next job if one fails. | `true` |

## Dry-Run Behavior
When `--dry-run` is active (which it is by default), the script will fully process the external request, parse the bindings, filter out entities with missing labels/descriptions, and log the final valid entity count. However, it will **not** invoke the `runManualImport` pipeline. As a result, no `ImportBatch`, `RawImportRecord`, `Entity`, `ReviewQueueItem`, or `SourceReference` rows are generated.

## Execution Example
To actually seed your database:
```bash
npm run import:years -- --from 1990 --to 1999 --types films,events --limit 50 --dry-run false --delay-ms 1500
```
