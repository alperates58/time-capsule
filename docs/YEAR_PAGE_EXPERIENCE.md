# Year Page Experience

## Philosophy
The `/[year]` page is the flagship experience of TimeCapsule. It must evoke a premium, atmospheric sense of entering a specific era. 

## Layout Architecture
1. **Year Hero (`year-hero.tsx`)**
   - The first impression. It uses a dynamic radial gradient background mapped to the `YearProfile`'s `primaryColor` design token to set the visual mood.
   - It prominently displays the year and the central theme (e.g., "The Dawn of the Modern Internet Age").

2. **Year Summary (`year-summary.tsx`)**
   - An editorial-style paragraph introducing the overarching narrative of that year.

3. **Year Highlights (`year-highlights.tsx`)**
   - A horizontal swipeable (on mobile) or grid (on desktop) carousel showcasing the top 5 most culturally significant entities of the year.

4. **Category Sections (`year-category-section.tsx`)**
   - Detailed groupings of the year's entities broken down by domain (Movies, Games, World Events, etc.). 
   - Entities are rendered via `YearEntityCard`, which includes smooth hover effects and embedded Source Notes.

## SEO & Accessibility
- The page leverages Next.js `generateMetadata` to dynamically create `<title>`, `<meta name="description">`, and Open Graph tags based on the `YearProfile` data.
- Color contrast is carefully managed via the Tailwind CSS variable system.
- An empty state handles years that have not yet been curated, preventing crashes and delivering a friendly "Coming Soon" message instead of a broken page.
