# Knowledge Graph Architecture

## Philosophy
TimeCapsule is not just a standard CMS; it is an interconnected knowledge graph. To help users visualize these connections, we implemented a custom Knowledge Graph Explorer. The design ensures maximum performance, accessibility, and strict separation of concerns so that we can eventually scale to powerful libraries like React Flow or Cytoscape without rewriting the entire data layer.

## Architecture: Data -> Adapter -> Renderer

1. **Data Fetching Layer (`lib/graph.ts`)**
   - We query the database for 1st-degree relations (both incoming and outgoing).
   - This protects the database from recursive infinite loops and keeps queries fast.

2. **Adapter Layer (`lib/graph.ts`)**
   - The raw database response (`fromRelations`, `toRelations`) is flattened and mapped into an abstract schema:
     - `nodes`: Array of `{ id, slug, title, type, isCentral }`
     - `edges`: Array of `{ id, fromId, toId, label }`
   - This abstract schema is what any future rendering library will consume.

3. **Presentation Layer (`components/graph/*`)**
   - **KnowledgeGraph Container**: A Server Component that fetches the adapted data and conditionally renders desktop/mobile views using CSS.
   - **GraphDesktopRenderer**: A Client Component that uses a math-based radial layout algorithm to distribute nodes in a circle around the central entity via absolute positioning.
   - **MobileRelationshipExplorer**: A fallback view for mobile users. Instead of forcing a cramped graph interface, it renders a scrollable card-based list of relationships.

## Scalability & Future Plans
By keeping the Adapter Layer pure, if we decide to install `react-flow-renderer` in Phase 15, we only need to replace the `GraphDesktopRenderer` component. The server logic and the `GraphData` interface will remain untouched.
