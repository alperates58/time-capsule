import { getEntityGraph } from "@/lib/graph";
import { GraphDesktopRenderer } from "./graph-desktop-renderer";
import { MobileRelationshipExplorer } from "./mobile-relationship-explorer";
import { Network } from "lucide-react";

interface KnowledgeGraphProps {
  slug: string;
}

export async function KnowledgeGraph({ slug }: KnowledgeGraphProps) {
  const data = await getEntityGraph(slug);

  if (!data || data.edges.length === 0) {
    return null; // Don't show the section if no relations exist
  }

  return (
    <section className="mt-16 pt-12 border-t border-border/40 max-w-6xl mx-auto px-6">
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-3xl font-extrabold tracking-tight flex items-center justify-center sm:justify-start gap-3">
          <Network className="w-8 h-8 text-primary" />
          Knowledge Graph Explorer
        </h2>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Visualizing 1st-degree historical connections for {data.nodes.find(n => n.isCentral)?.title}.
        </p>
      </div>

      {/* Desktop view: Interactive radial graph */}
      <div className="hidden md:block">
        <GraphDesktopRenderer data={data} />
      </div>

      {/* Mobile view: Card based explorer */}
      <div className="md:hidden">
        <MobileRelationshipExplorer data={data} />
      </div>
    </section>
  );
}
