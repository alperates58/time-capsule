import { NextResponse } from 'next/server';
import { ProviderRegistry } from '@/lib/import/providers/provider-registry';

const ALLOWED_TYPES = ['events', 'films', 'births', 'deaths'];
const ALLOWED_PROVIDERS = ['wikidata'];

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      mode, // 'single' | 'range'
      year,
      from,
      to,
      provider,
      types,
      limit = 10,
      dryRun = true,
      delayMs = 1000,
      continueOnError = true
    } = body;

    // Validation
    if (!ALLOWED_PROVIDERS.includes(provider)) {
      return NextResponse.json({ error: 'Invalid or unsupported provider' }, { status: 400 });
    }

    if (!Array.isArray(types) || types.length === 0 || !types.every(t => ALLOWED_TYPES.includes(t))) {
      return NextResponse.json({ error: 'Invalid or missing types' }, { status: 400 });
    }

    if (typeof limit !== 'number' || limit < 1 || limit > 50) {
      return NextResponse.json({ error: 'Limit must be between 1 and 50' }, { status: 400 });
    }

    let startYear: number;
    let endYear: number;

    if (mode === 'single') {
      if (!year || typeof year !== 'number') return NextResponse.json({ error: 'Invalid year' }, { status: 400 });
      startYear = year;
      endYear = year;
    } else if (mode === 'range') {
      if (!from || !to || typeof from !== 'number' || typeof to !== 'number') {
        return NextResponse.json({ error: 'Invalid from/to years' }, { status: 400 });
      }
      if (from > to) {
        return NextResponse.json({ error: 'from year must be <= to year' }, { status: 400 });
      }
      if (to - from > 10) {
        return NextResponse.json({ error: 'Maximum range is 10 years per run' }, { status: 400 });
      }
      startYear = from;
      endYear = to;
    } else {
      return NextResponse.json({ error: 'Invalid mode' }, { status: 400 });
    }

    // Build the queue
    const queue: { year: number; type: string }[] = [];
    for (let y = startYear; y <= endYear; y++) {
      for (const t of types) {
        queue.push({ year: y, type: t });
      }
    }

    const stats = {
      processed: 0,
      success: 0,
      failed: 0,
      totalImported: 0,
      totalSkipped: 0,
      totalErrors: 0,
      details: [] as string[]
    };

    // Process the queue synchronously to respect delay and rate limits
    for (let i = 0; i < queue.length; i++) {
      const job = queue[i];
      try {
        const providers = ProviderRegistry.getProvidersForType(job.type);
        const matchingProvider = providers.find(p => p.id.toLowerCase() === provider.toLowerCase());
        
        if (!matchingProvider) {
          stats.processed++;
          stats.failed++;
          stats.details.push(`No provider found for ${job.type}`);
          continue;
        }

        const result = await matchingProvider.fetch(job.year, job.type, limit, dryRun);
        
        stats.processed++;
        if (result && result.success) {
          stats.success++;
          stats.totalImported += result.importedEntities;
          stats.totalSkipped += result.skipped;
          stats.totalErrors += result.errors.length;
          stats.details.push(`[${job.year} ${job.type}] Success: ${result.importedEntities} imported, ${result.skipped} skipped`);
        } else if (result) {
          stats.failed++;
          stats.totalErrors += result.errors.length;
          stats.details.push(`[${job.year} ${job.type}] Failed with ${result.errors.length} errors`);
          if (!continueOnError) {
            stats.details.push('Aborting due to continueOnError=false');
            break;
          }
        }
      } catch (err: any) {
        stats.processed++;
        stats.failed++;
        stats.details.push(`[${job.year} ${job.type}] Unexpected error: ${err.message}`);
        if (!continueOnError) break;
      }

      if (i < queue.length - 1) {
        await sleep(Math.min(delayMs, 5000)); // cap delay to 5s for safety
      }
    }

    return NextResponse.json({ success: true, stats, dryRun });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
