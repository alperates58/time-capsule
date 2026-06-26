# TimeCapsule Database Schema

This document provides a high-level overview of the Prisma schema used for the TimeCapsule project. The schema relies on a highly decoupled Knowledge Graph approach to ensure unlimited scalability.

## 1. Core Entity & Relationship Models

**`Entity`**
The absolute center of the database. Every concept (Movie, Person, Country, Year) is stored here.
- `id` (UUID), `type` (Enum), `slug` (Unique String)
- Core attributes: `title`, `description`, `startDate`, `endDate`, `status`
- Dynamic attributes: `metadata` (JSON), `seo` (JSON)

**`EntityRelation`**
Defines edges between `Entity` nodes. No pivot tables are needed for specific categories (e.g., no `MovieActors` table).
- `fromEntityId` -> `toEntityId`
- `relationType` (Enum: `DIRECTED_BY`, `LOCATED_IN`, etc.)
- Temporal scoping: `startDate`, `endDate` (e.g., married from 1990 to 2000).

**`EntityAlias`**
Handles alternate namings across different languages.
- `entityId`, `name`, `language`

## 2. Source Attribution & Import Pipeline

**`Source` & `SourceReference`**
Every piece of data must be traceable. `Source` registers the origin API (e.g., TMDB). `SourceReference` links a specific `Entity` or `EntityRelation` back to the exact external ID and raw payload.

**`ImportBatch` & `RawImportRecord`**
Tracks scheduled/manual ingestion runs. Raw payloads are stored securely to prevent API data loss and allow deterministic reprocessing without network overhead.

**`ReviewQueueItem`**
Whenever conflict resolution strategies fail (e.g., low confidence match), a task is appended here for admin intervention.

## 3. Organizational Models

**`YearProfile`**
Stores editorial themes and configuration for a given year (e.g., "The Dot-Com Boom" for 1999) rather than acting as a hard source of truth for events.

**`Category` & `EntityCategory`**
Hierarchical tagging taxonomy. An entity can belong to multiple categories (e.g., "Sci-Fi", "80s Action").

## 4. Architectural Rules
- **No Direct Table Expansion:** We do not create tables like `Games`, `Cars`, `Events`. Instead, we add new `EntityType` enums and store varied parameters in the `metadata` JSON blob.
- **Cascading Deletes:** Deleting an `Entity` aggressively drops all related `EntityAlias`, `EntityRelation`, and `EntityCategory` entries. However, it explicitly restricts deleting `Source` items to maintain audit trails.
