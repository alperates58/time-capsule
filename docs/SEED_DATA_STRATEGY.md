# Seed Data Strategy

## Purpose
The seed data provides a controlled, predictable foundation for TimeCapsule to prove the architecture works before connecting to complex external APIs. 

## Golden Sample Year: 1998
We use 1998 as our test bed because it represents the dawn of the modern internet and features iconic cultural touchstones (Google, Windows 98, iMac, Titanic, Ocarina of Time, Half-Life) that stress-test our data models across multiple categories (Movies, Games, Technology, World Events).

## Idempotency
The seed script (`prisma/seed.ts`) is fully idempotent. It uses `prisma.entity.upsert` with unique `slug` identifiers to ensure that running `npm run prisma:seed` multiple times will never duplicate entities.

## Categories & Sources
- Categories like "Movies", "Games", and "World Events" are created.
- Entities are linked to these categories using the `EntityCategory` join table with a high confidence score.
- We insert placeholder sources (`TMDB`, `Wikidata`, `Wikipedia`) to prove the provenance tracking works. Every seed entity has a `SourceReference` linking it to these placeholders, ensuring we never have "orphaned" facts.

## Relationships vs Strict Timelines
While a naive model would only query entities where `startDate` is in 1998, real history is messy. For example, *Titanic* was released in December 1997 but completely dominated the 1998 cultural landscape. 
Currently, the basic UI fetches by `startDate`. In future iterations, we will use the `EntityRelation` graph (e.g., `CULTURAL_IMPACT_IN_YEAR`) to pull in entities like Titanic into the 1998 feed even if they were born in 1997. This seed data provides the perfect playground to test those graph queries.
