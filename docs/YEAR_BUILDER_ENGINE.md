# Year Builder Engine

The Year Builder Engine (`src/lib/year-builder/`) replaces manual entity queries with a deterministic, multi-stage curation pipeline. It ensures that any year page (e.g. `/1998`) is entirely generated from the data available in the Prisma database without relying on manual page assembly.

## Architecture

1. **`types.ts`**: Declares `YearPageData`, the canonical object format consumed by the UI.
2. **`year-builder.ts` (Master Orchestrator)**: Queries the database exactly once to fetch all overlapping entities (those that started in, ended in, or spanned across the target year) and their categories/relations.
3. **`hero-selector.ts`**: Uses a deterministic scoring algorithm (see below) to pick the most impactful entity of the year to serve as the Hero background.
4. **`highlight-selector.ts`**: Extracts top 10 entities per domain (events, people, movies, games, tech) based on the same scoring logic.
5. **`timeline-builder.ts`**: Chronologically sorts events.
6. **`category-builder.ts`**: Dynamically maps entities into structured categories (`EntityCategory`) so the UI can render grid layouts.
7. **`theme-builder.ts`**: Applies `YearProfile` design tokens to the engine payload.
8. **`navigation-builder.ts`**: Automatically sets up anchor links based on the available data.

## The Deterministic Scoring Algorithm

We explicitly avoid AI for ranking to ensure absolute determinism, speed, and cacheability. 

The formula for `calculateEntityScore` is:
- **Base Type Value**: High impact (Events, Tech) = `+20`, Medium impact (Movies, Games) = `+10`, Others = `+5`.
- **Connectedness**: `+2` points for every incoming relationship this entity has. Highly cited entities rank higher.
- **Year Origination Multiplier**: If `entity.startDate` falls inside the target year, the score is multiplied by `1.5`. Multi-year entities (e.g., a TV show started in 1994) can still appear, but they are penalized during Hero selection compared to native events.
- **Editor Override**: If an entity is marked as the `primaryEventEntityId` in `YearProfile`, it receives an unassailable `+500` point bonus, overriding the algorithm.
