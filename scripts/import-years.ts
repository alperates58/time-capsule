import { ProviderRegistry } from "../src/lib/import/providers/provider-registry";

// Parse CLI arguments
const args = process.argv.slice(2);
let fromYear: number | null = null;
let toYear: number | null = null;
let singleYear: number | null = null;
let types: string[] = ["events", "films", "births", "deaths"];
let limit: number = 10;
let dryRun: boolean = true;
let delayMs: number = 1000;
let continueOnError: boolean = true;

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === "--from" && args[i + 1]) fromYear = parseInt(args[++i], 10);
  else if (arg === "--to" && args[i + 1]) toYear = parseInt(args[++i], 10);
  else if (arg === "--year" && args[i + 1]) singleYear = parseInt(args[++i], 10);
  else if (arg === "--types" && args[i + 1]) types = args[++i].split(",");
  else if (arg === "--limit" && args[i + 1]) limit = parseInt(args[++i], 10);
  else if (arg === "--dry-run") {
    const nextArg = args[i + 1];
    if (nextArg === "false" || nextArg === "0") {
      dryRun = false;
      i++;
    } else if (nextArg === "true" || nextArg === "1") {
      dryRun = true;
      i++;
    } else {
      dryRun = true;
    }
  }
  else if (arg === "--delay-ms" && args[i + 1]) delayMs = parseInt(args[++i], 10);
  else if (arg === "--continue-on-error") {
    const nextArg = args[i + 1];
    if (nextArg === "false" || nextArg === "0") {
      continueOnError = false;
      i++;
    } else {
      continueOnError = true;
    }
  }
}

if (!singleYear && (!fromYear || !toYear)) {
  console.error("Error: Must provide either --year OR both --from and --to");
  process.exit(1);
}

const startYear = singleYear || fromYear!;
const endYear = singleYear || toYear!;

if (startYear > endYear) {
  console.error("Error: --from year must be less than or equal to --to year");
  process.exit(1);
}

// Build the job queue
interface Job {
  year: number;
  type: string;
}

const queue: Job[] = [];
for (let y = startYear; y <= endYear; y++) {
  for (const t of types) {
    queue.push({ year: y, type: t.trim() });
  }
}

console.log("========================================");
console.log(`BULK YEAR IMPORT ORCHESTRATOR`);
console.log("========================================");
console.log(`Years: ${startYear} to ${endYear}`);
console.log(`Types: ${types.join(", ")}`);
console.log(`Limit per request: ${limit}`);
console.log(`Delay between requests: ${delayMs}ms`);
console.log(`DRY RUN: ${dryRun ? "YES (Safe)" : "NO (WILL MUTATE DATABASE)"}`);
console.log(`Total Jobs to process: ${queue.length}`);
console.log("========================================\n");

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runBulkImport() {
  const startTime = Date.now();
  
  const stats = {
    processed: 0,
    success: 0,
    failed: 0,
    totalImported: 0,
    totalSkipped: 0,
    totalErrors: 0
  };

  for (let i = 0; i < queue.length; i++) {
    const job = queue[i];
    console.log(`\n[Job ${i + 1}/${queue.length}] Processing ${job.type} for year ${job.year}...`);
    
    try {
      const providers = ProviderRegistry.getProvidersForType(job.type);
      if (providers.length === 0) {
        console.warn(`No provider found supporting type: ${job.type}. Skipping.`);
        stats.processed++;
        stats.failed++;
        continue;
      }
      
      // For now, use the first provider that supports the type
      const provider = providers[0];
      const result = await provider.fetch(job.year, job.type, limit, dryRun);
      
      stats.processed++;
      if (result && result.success) {
        stats.success++;
        stats.totalImported += result.importedEntities;
        stats.totalSkipped += result.skipped;
        stats.totalErrors += result.errors.length;
      } else if (result) {
        stats.failed++;
        stats.totalErrors += result.errors.length;
        if (!continueOnError) {
          console.error("Job failed and --continue-on-error is false. Aborting orchestrator.");
          break;
        }
      }
    } catch (err: any) {
      stats.processed++;
      stats.failed++;
      console.error(`Unexpected Error processing ${job.year} ${job.type}:`, err.message);
      if (!continueOnError) {
        console.error("Aborting orchestrator.");
        break;
      }
    }

    if (i < queue.length - 1) {
      console.log(`Waiting ${delayMs}ms before next request...`);
      await sleep(delayMs);
    }
  }

  const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log("\n========================================");
  console.log(`BULK IMPORT COMPLETE`);
  console.log("========================================");
  console.log(`Time Elapsed:    ${elapsedSeconds}s`);
  console.log(`Jobs Processed:  ${stats.processed} / ${queue.length}`);
  console.log(`Jobs Successful: ${stats.success}`);
  console.log(`Jobs Failed:     ${stats.failed}`);
  console.log(`Total Entities:  ${stats.totalImported}`);
  console.log(`Total Skipped:   ${stats.totalSkipped}`);
  console.log(`Total Errors:    ${stats.totalErrors}`);
  console.log("========================================");
  
  if (dryRun) {
    console.log("\nNote: This was a DRY RUN. No data was actually saved to the database.");
  }
}

runBulkImport()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
