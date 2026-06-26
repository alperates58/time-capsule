# TimeCapsule Import Pipeline Architecture (Phase 4)

This document outlines the scalable data ingestion architecture for TimeCapsule. As the platform aims to be the "digital memory of the world," it will ingest data from multiple disparate sources (Wikidata, Wikipedia, TMDB, MusicBrainz, NASA, World Bank, etc.). This architecture guarantees data integrity, traceability, and conflict resolution without manual bottlenecks.

---

## 1. Source Registry
Before any data is ingested, its origin must be registered. The Source Registry acts as the definitive catalog of all external data providers.
- **Registration Process:** Sources are added via an Admin UI or configuration file.
- **Metadata:** Name, API endpoint, documentation URL, rate limits.
- **Trust Level (1-100):** Determines merge priority. (e.g., NASA = 99 for space events, Wikidata = 85 for general facts, User Submission = 40).
- **License:** CC-BY-SA, Public Domain, Commercial, etc., to ensure legal compliance for attribution.
- **Update Frequency:** Real-time, Daily, Weekly, or Static Dumps.

## 2. Import Jobs
The pipeline relies on decoupled background workers to handle ingestion.
- **Scheduled Jobs:** Cron-based triggers for polling APIs (e.g., fetching new TMDB movie releases weekly).
- **Manual Jobs:** Triggered by admins for massive one-off data dumps (e.g., parsing a 50GB Wikidata JSON dump).
- **Failure Handling & Retries:** Implements exponential backoff for rate limits (HTTP 429) or network timeouts. Failed batches are moved to a Dead-Letter Queue (DLQ) for admin inspection rather than blocking the pipeline.

## 3. Raw Data Layer (Data Lake)
Before any transformation occurs, the exact, unmodified payload (JSON/XML/CSV) fetched from the source is saved into a Raw Data Layer (e.g., an S3 bucket or a NoSQL document store).
- **Why store raw data?** 
  1. **Auditability:** We can always prove exactly what the API returned at that timestamp.
  2. **Re-normalization:** If our normalization logic has a bug, we can re-parse the raw data without re-fetching it and hitting API rate limits.
  3. **Data Loss Prevention:** External APIs shut down or change. Storing the raw payload ensures we never lose historical data points.

## 4. Normalization Layer
The Normalization Layer consists of source-specific Adapters. 
- It maps the raw schema (e.g., TMDB's `release_date`) to TimeCapsule's abstract `Entity` and `Relationship` domain model.
- It converts all dates to a standard ISO-8601 format, trims whitespace, standardizes currencies to USD for comparison, and formats all slugs.

## 5. Entity Matching (Deduplication)
To prevent duplicated entities, incoming normalized data is passed through a deterministic matching engine before insertion.
- **Movie:** Exact Title + Release Year (e.g., "The Matrix" + 1999).
- **Person:** Full Name + Birth Date + (Optional) Nationality.
- **Company:** Name + Founded Year.
- **Country:** ISO 3166-1 alpha-2 / alpha-3 code.
- **Event:** Title + Exact Start Date.
- **Book:** ISBN (Primary) OR Exact Title + Author Name.
- **Game:** Exact Title + Release Year + Platform.
- **Album:** Exact Title + Artist Name + Release Year.

*If an exact match is found, the system triggers Merge Rules. If no match is found, a new Entity is created.*

## 6. Merge Rules & Conflict Resolution
When an entity already exists but a new source provides data for it, the system uses strict merge rules:
- **Priority Order:** The source with the highest `trust_level` wins. (e.g., For a movie's release date, TMDB (95) overwrites Wikidata (80)).
- **Conflict Resolution:** If trust levels are identical, the most recently updated source wins.
- **Missing Fields:** If the primary source is missing a field (e.g., TMDB has no budget data), a lower-priority source (e.g., Wikidata) is allowed to fill the `null` gap without overwriting existing data.
- **Overwrite Strategy:** High-trust sources can silently overwrite low-trust sources. Low-trust sources cannot overwrite high-trust sources.

## 7. Review Queue
Not all matches are perfect. When the matching engine yields a "fuzzy" or low-confidence match (e.g., "Steve Jobs" vs "Steven Paul Jobs" with differing birth dates), the pipeline pauses ingestion for that specific entity.
- The entity is sent to the **Review Queue**.
- A human admin or a highly-trusted Editor uses a side-by-side comparison UI to manually "Merge" or "Split" the entity.

## 8. Source Attribution
TimeCapsule does not hallucinate facts. Every single field on an entity, and every relationship edge, contains a `source_reference_id`.
- The UI can display a tiny citation link (like Wikipedia) next to data points.
- Users can click the citation to see exactly which import job and which registry source provided that specific fact.

## 9. Import History
Every action taken by the import pipeline is logged.
- The database tracks `created_by_job_id` and `updated_by_job_id`.
- An audit trail shows the lifecycle of an entity: *Created by Wikidata Dump (Jan 1) -> Updated by TMDB API (Jan 5) -> Manually Edited by Admin (Jan 10).*

## 10. Future AI Integration
AI is treated as a highly capable but *untrusted* worker.
- **Enrichment, not Creation:** AI will not generate raw data from its latent space. Instead, it will read raw text (e.g., a Wikipedia article) and extract structured relationships (e.g., `Person -> ParticipatedIn -> War`).
- **Trust Level Restrictions:** AI will be assigned a low `trust_level` (e.g., 50). It can fill empty gaps but can never overwrite data imported from verified APIs (like World Bank or TMDB).
- **Mandatory Review:** For critical or highly sensitive historical data, AI-generated relationships will be automatically routed to the Review Queue for human validation before going public.
