# TimeCapsule Domain Model (Phase 3)

This document defines the comprehensive domain model for TimeCapsule. The platform is designed to eventually support millions of entities and relationships, acting as the definitive "digital memory of the world." 

## 1. Global Rules
- **No Duplicated Data:** Everything is normalized. If a person is an Actor in a Movie and a Director in another, they are a single `Person` entity linked via different relationship types.
- **Everything is an Entity:** Years, People, Movies, Events, and Companies are all top-level entities.
- **Everything is Sourceable:** Every entity and relationship must have a `source_reference_id` or `confidence_score` to prevent AI hallucinations.
- **Everything is Versionable:** Edits to entities create a new version history record.
- **Everything is Extensible:** Entities use a base schema extended by type-specific JSON properties (`metadata` field) to prevent schema bloat (e.g., specific camera lenses used in a movie don't need a dedicated SQL column).

---

## 2. Core Entities

To ensure scalability, entities are grouped by domain. All entities inherit from a **Base Entity** structure that includes `id`, `type`, `title`, `slug`, `short_description`, `long_description`, `canonical_image`, `created_at`, `updated_at`, and `status`.

### 2.1 Time Domain
#### Year
- **Purpose:** The central anchor for TimeCapsule. Acts as a temporal gateway.
- **Required:** `year_number` (int)
- **Optional:** `theme_color`, `defining_quote`, `global_mood`
- **Slug Strategy:** `/year/1998`
- **SEO:** "What happened in 1998?", "1998 pop culture and events"
- **Relationships:** `OccursIn`, `ReleasedIn`, `BornIn`, `DiedIn`

#### Timeline
- **Purpose:** A curated sequence of events around a specific topic (e.g., "History of the Internet").
- **Required:** `title`, `slug`
- **Optional:** `curator_id`, `cover_image`
- **Slug Strategy:** `/timeline/history-of-the-internet`
- **SEO:** "Internet timeline", "Evolution of the web"
- **Relationships:** `ContainsEvent`

### 2.2 Media & Entertainment Domain
#### Movie
- **Purpose:** Cinematic releases.
- **Required:** `title`, `release_date`
- **Optional:** `runtime`, `budget`, `box_office`, `imdb_id`
- **Slug Strategy:** `/movie/[title]-[year]` (e.g., `/movie/titanic-1997`)
- **SEO:** "[Title] ([Year]) cast, release date, and reviews"
- **Relationships:** `DirectedBy`, `ProducedBy`, `Starring` (Person), `ReleasedIn` (Year)

#### TV Series
- **Purpose:** Television and streaming shows.
- **Required:** `title`, `start_year`
- **Optional:** `end_year`, `network`, `seasons_count`
- **Slug Strategy:** `/tv/[title]-[start_year]`
- **SEO:** "[Title] TV Series ([Year]) episodes and cast"
- **Relationships:** `CreatedBy`, `AiredOn`, `Starring`

#### Anime
- **Purpose:** Japanese animation (requires specific metadata like studios and simulcast seasons).
- **Required:** `title`, `release_date`
- **Optional:** `studio`, `episodes`, `source_material`
- **Slug Strategy:** `/anime/[title]-[year]`
- **SEO:** "[Title] Anime release and characters"
- **Relationships:** `AnimatedBy`, `BasedOn`

#### Book
- **Purpose:** Published literature.
- **Required:** `title`, `publication_date`, `author_id` (via relation)
- **Optional:** `isbn`, `pages`, `publisher`
- **Slug Strategy:** `/book/[title]-[year]`
- **SEO:** "[Title] by [Author] summary and publication date"
- **Relationships:** `WrittenBy`, `PublishedBy`

#### Album / Song
- **Purpose:** Musical releases.
- **Required:** `title`, `release_date`
- **Optional:** `label`, `genre`, `duration` (Song), `track_count` (Album)
- **Slug Strategy:** `/music/album/[title]-[artist]-[year]` or `/music/song/...`
- **SEO:** "[Title] by [Artist] lyrics and release year"
- **Relationships:** `PerformedBy`, `ProducedBy`, `PartOf` (Song to Album)

#### Game / Console
- **Purpose:** Video games and gaming hardware.
- **Required:** `title`, `release_date`
- **Optional:** `platform`, `developer`, `engine`
- **Slug Strategy:** `/game/[title]-[year]` or `/tech/console/[title]`
- **SEO:** "[Title] release date, gameplay, and developer"
- **Relationships:** `DevelopedBy`, `PublishedBy`, `PlayableOn` (Game to Console)

### 2.3 People Domain
#### Person (Actor, Director, Artist, Historical Figure)
- **Purpose:** Any notable human being. Roles (Actor, Director) are handled via *Relationships*, not separate entity tables.
- **Required:** `full_name`
- **Optional:** `birth_date`, `death_date`, `nationality`, `known_for`
- **Slug Strategy:** `/person/[full-name]` (Append ID if collision occurs)
- **SEO:** "[Name] biography, movies, and history"
- **Relationships:** `BornIn` (Country/City/Year), `DiedIn`, `Directed`, `StarredIn`

### 2.4 Geography Domain
#### Country / City
- **Purpose:** Geopolitical locations.
- **Required:** `name`, `iso_code` (Country)
- **Optional:** `population`, `founded_date`
- **Slug Strategy:** `/place/country/[name]`, `/place/city/[name]-[country-code]`
- **SEO:** "History of [City], [Country]"
- **Relationships:** `LocatedIn` (City to Country), `OccursIn` (Event to City)

### 2.5 History & Events Domain
#### Historical Event / War / Election / Olympics / Sports Event
- **Purpose:** Fixed points in time where something notable happened.
- **Required:** `title`, `start_date`
- **Optional:** `end_date`, `casualties` (War), `winner_id` (Election)
- **Slug Strategy:** `/event/[title]-[year]`
- **SEO:** "What happened during [Title] in [Year]?"
- **Relationships:** `Involved` (Person/Country), `OccursIn` (Location/Year)

#### Award
- **Purpose:** Recognitions (e.g., Oscars, Nobel Prizes).
- **Required:** `title`, `year_awarded`
- **Optional:** `category`
- **Slug Strategy:** `/award/[title]-[year]`
- **SEO:** "Who won the [Title] in [Year]?"
- **Relationships:** `WonBy` (Person/Movie/Etc), `PresentedBy` (Organization)

### 2.6 Technology & Science
#### Phone / Car / Software / OS / Website / AI Model / Space Mission / Technology
- **Purpose:** Human inventions, products, and milestones.
- **Required:** `name`, `launch_date`
- **Optional:** `manufacturer`, `version`, `price_at_launch`
- **Slug Strategy:** `/tech/[category]/[name]-[year]`
- **SEO:** "[Name] launch date, specs, and history"
- **Relationships:** `CreatedBy` (Company), `SucceededBy`, `PrecededBy`, `CompatibleWith`

### 2.7 Culture & Society
#### Brand / Company / Organization
- **Purpose:** Corporate and social groups.
- **Required:** `name`, `founded_date`
- **Optional:** `founders`, `headquarters`
- **Slug Strategy:** `/org/[name]`
- **SEO:** "History and founding of [Name]"
- **Relationships:** `FoundedBy`, `LocatedIn`, `Owns` (Brand)

#### Building / Museum
- **Purpose:** Architectural landmarks.
- **Required:** `name`, `opened_date`
- **Optional:** `architect`, `style`
- **Slug Strategy:** `/landmark/[name]-[city]`
- **SEO:** "When was [Name] built?"
- **Relationships:** `DesignedBy`, `LocatedIn`

#### Holiday / Food / Disease
- **Purpose:** Cultural phenomena and biology.
- **Required:** `name`
- **Optional:** `origin`, `discovery_date`
- **Slug Strategy:** `/culture/[category]/[name]`
- **SEO:** "History of [Name]"
- **Relationships:** `DiscoveredBy`, `OriginatedIn`

---

## 3. Relationship Model (The Graph)

TimeCapsule is fundamentally a knowledge graph. Instead of hardcoding foreign keys for every possible edge, we use a unified `Relationships` structure:
- `source_entity_id` (e.g., Movie ID)
- `target_entity_id` (e.g., Person ID)
- `relation_type` (Enum)
- `start_date` / `end_date` (Optional temporal bounds, e.g., for marriages or job roles)

### Core Relationship Types
- **Creation & Production:** `DirectedBy`, `ProducedBy`, `CreatedBy`, `WrittenBy`, `DevelopedBy`, `AnimatedBy`, `DesignedBy`
- **Participation:** `Starring`, `InvolvedIn`, `MemberOf`
- **Temporal & Spatial:** `ReleasedIn`, `BornIn`, `DiedIn`, `LocatedIn`, `OccursIn`, `FoundedIn`
- **Hierarchical & Lineage:** `PartOf` (Song to Album), `OwnedBy` (Brand to Company), `SucceededBy` (iPhone 4 to iPhone 3GS), `PrecededBy`, `InspiredBy`, `BasedOn`
- **Achievements:** `WinnerOf`, `DiscoveredBy`

---

## 4. Scalability & Extensibility
By treating every noun as an `Entity` and every verb as a `Relationship`, the database schema remains incredibly narrow and highly scalable. We do not need a table with 50 columns for a "Movie". Instead, a Movie has base entity fields, a JSON `metadata` blob for niche data (like runtime), and dozens of `Relationships` linking it to Directors, Actors, Studios, and Years. This allows TimeCapsule to easily expand to new categories (like "Fashion Trends" or "Memes") without ever running schema migrations.
