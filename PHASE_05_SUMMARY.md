# Phase 5 Summary: Prisma Knowledge Graph Schema

## Objectives Completed
- Designed and implemented the first real `schema.prisma`.
- Replaced the temporary `Placeholder` model with a highly flexible, knowledge-graph-friendly schema.
- Embedded all rules from `DOMAIN_MODEL.md` (Phase 3) and `IMPORT_PIPELINE.md` (Phase 4).
- Added all requested tables, enums, and comprehensive indexing.

## Schema Decisions & Principles
1. **Entity-Centric:** Rather than a separate table for `Movie` and `Person`, everything relies on the core `Entity` table. Type-specific properties are pushed into `metadata` (JSON), drastically reducing database bloat.
2. **Relationships First:** `EntityRelation` handles all edges (`DIRECTED_BY`, `LOCATED_IN`, `RELEASED_IN`) preventing the need for complex pivot tables.
3. **Traceability:** Every node (`Entity`) and edge (`EntityRelation`) can optionally link to a `SourceReference`. Facts are never orphaned from their origin.
4. **Data Ingestion Native:** The `ImportBatch`, `RawImportRecord`, and `ReviewQueueItem` tables integrate directly with the database level to ensure external data flows efficiently and can be managed or audited.

## What Was Intentionally NOT Modeled Yet
- **User Authentication / RBAC:** Admin and Editor roles were excluded from this schema. Authentication is typically handled via NextAuth or Clerk, and user profiles/roles will be added in a separate User/Auth phase.
- **Year Pages (Static Caching):** While `YearProfile` exists for editorial configuration, there is no massive denormalized table pre-computing facts for a given year. The query engine will derive those on-the-fly to ensure truth flows naturally from entities.

## Verification
- Local build, lint, and standalone docker build processes were tested. Everything compiles cleanly with the new generated Prisma client.

## Next Steps
This solidifies the data layer. The next phase can focus on creating the GraphQL/REST API layers or implementing the frontend entity views.
