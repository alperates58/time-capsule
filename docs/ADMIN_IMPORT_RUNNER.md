# Admin Import Runner

The Admin Import Runner is an internal UI tool allowing authorized personnel to run batch data imports natively without relying on CLI scripts.

## Safety Measures

To protect database integrity and system stability, the following safety limits are enforced:
- **Max Range limit**: Imports can span up to **10 years** in a single run.
- **Max Items Limit**: A maximum of **50 records** per provider request.
- **Rate Limiting**: Configurable delay (default 1000ms) is placed between queries to respect external API limitations (like Wikidata).
- **Dry Run Default**: By default, imports are executed in `dryRun` mode, meaning no database mutations occur. A clear warning is presented to the user when disabled.

## Implementation Details
The runner operates entirely inside the Next.js process:
- Submits a POST payload to `/api/admin/imports/run`.
- Protected by Edge Middleware ensuring valid JWT `ADMIN_COOKIE_NAME` exists.
- Relies on internal singleton `ProviderRegistry` for provider resolution.
- Never spins up `child_process` hooks, mitigating shell injection vulnerabilities.

## How It Works
1. Validates the incoming range/types/limits.
2. Builds an internal job queue (e.g., Year 1998 Events, 1998 Films).
3. Iterates through the queue, calling `provider.fetch()`.
4. Accumulates results and logs.
5. Returns a unified JSON summary object containing counts for imported entities, failures, and skips.
