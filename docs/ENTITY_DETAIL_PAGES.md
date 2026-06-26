# Entity Detail Pages

## Philosophy
The `Entity` is the foundational unit of TimeCapsule. Everything—be it a person, movie, event, or product—is an entity. The Entity Detail Page (`/entity/[slug]`) is designed to showcase not only the entity itself but its interconnected place within the larger knowledge graph.

## Layout Architecture
1. **Contextual Navigation**
   - Automatically provides a "Back to [Year]" link if the entity has a `startDate`. This anchors the entity in time and encourages continuous exploration.
2. **Entity Hero (`entity-hero.tsx`)**
   - A clean, prominent title with subtitle and description providing immediate context.
3. **Entity Metadata (`entity-metadata.tsx`)**
   - Quick-glance tags for the Entity `Type` (e.g., Movie, Event), `Status` (e.g., Released), and exact `startDate`/`endDate`.
4. **Entity Relation List (`entity-relation-list.tsx`)**
   - The most important discovery mechanism. Displays both outgoing (`fromRelations`) and incoming (`toRelations`) connections (e.g., Google `CREATED_BY` Larry Page).
5. **Entity Category List (`entity-category-list.tsx`)**
   - Renders the domains this entity belongs to (e.g., "Technology", "World Events").
6. **Entity Source Note (`entity-source-note.tsx`)**
   - Transparently displays the data source (Wikipedia, Wikidata) and the citation string to maintain academic rigor and trust.

## SEO Strategy
- Dynamic `generateMetadata` pulls the entity's title and description.
- Generates Open Graph tags for rich social sharing.
- If a user navigates to an invalid slug, the server intercepts and returns `robots: { index: false }` along with a premium `EntityNotFound` component to avoid polluting search indexes with 404s.
