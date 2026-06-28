# Phase 14 Summary: Year Builder Engine

## Objectives Completed
- Architected the `Year Builder Engine`, the core backend system responsible for dynamically assembling History into digestible Year Pages.
- Implemented deterministic ranking systems (Scoring Algorithm) instead of LLMs for speed and consistency.
- Separated business logic from the UI. The UI components in `src/app/[year]/page.tsx` now only receive a pre-computed `YearPageData` object instead of querying Prisma directly.

## Key Features & Constraints Respected
- **Deterministic Scoring**: Entities are given a base score based on their `EntityType` (Events/Tech are heavily weighted), `+2` points per connected relationship, and a `1.5x` multiplier if they originated in the requested year. Editors can override with a `+500` manual point injection via `YearProfile`.
- **Multi-year Spanning**: The orchestrator correctly queries Prisma for any entity that overlaps with the target year (started before, ended after), meaning long-running TV shows or events will show up in timeline/categories but likely won't win "Hero" status over a native major launch.
- **No API Changes / Clean UI**: Kept existing UI behavior intact. Converted the heavily structured `Highlights` object back into a flat `slice(0, 5)` array to satisfy the existing `year-highlights.tsx` UI component without rewriting front-end logic.

## Future Scalability
The `src/lib/year-builder/` directory is highly modular. As TimeCapsule grows, we can add `trivia-builder.ts` or `soundtrack-builder.ts` and simply append them to the master orchestrator in `year-builder.ts`. Because it uses a single complex Prisma query upfront, Database reads are extremely optimized.
