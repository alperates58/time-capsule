# Navigation and Discovery

## Philosophy
TimeCapsule requires an intuitive way for users to discover history. We rely on standard anchor links for page sections and dedicated UI elements for jumping between years. All navigation should work without Javascript where possible (standard `<Link>` tags) except for the YearSelector form which uses client-side routing for convenience.

## Components
- **Header (`layout/header.tsx`)**: Responsive top navigation connecting the user to global anchors (`#explore`, `#years`, `#about`) and the featured `1998` dataset.
- **YearSelector (`navigation/year-selector.tsx`)**: A client-side form on the homepage allowing users to input a specific year to navigate to.
- **Breadcrumb (`navigation/breadcrumb.tsx`)**: Placed on `/[year]` pages to provide context and an easy way to return to the interactive timeline.
- **YearNavigation (`navigation/year-navigation.tsx`)**: Rendered at the bottom of the `/[year]` page to allow sequential browsing (Previous Year / Next Year). It computes boundaries dynamically using utility functions.
- **DiscoveryCTA (`navigation/discovery-cta.tsx`)**: Used primarily on non-curated (empty) year pages to guide users back to our "Golden Sample Year" (1998).

## Routes Utility
The `src/lib/routes.ts` file acts as the central truth for valid time ranges and URL patterns. This prevents UI components from hardcoding paths.

## SEO Strategy
- The homepage includes rich `Metadata`.
- Non-curated year pages (years not yet in the DB) dynamically return `robots: { index: false, follow: false }` to prevent search engines from indexing thin or empty content.
