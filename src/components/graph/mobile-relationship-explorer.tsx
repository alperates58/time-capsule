import Link from "next/link";
import { GraphData } from "@/lib/graph";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightLeft } from "lucide-react";

interface MobileRelationshipExplorerProps {
  data: GraphData;
}

export function MobileRelationshipExplorer({ data }: MobileRelationshipExplorerProps) {
  const centralNode = data.nodes.find(n => n.isCentral);
  
  if (!centralNode) return null;

  return (
    <div className="space-y-4">
      {data.edges.map((edge) => {
        const isOutgoing = edge.fromId === centralNode.id;
        const otherNodeId = isOutgoing ? edge.toId : edge.fromId;
        const otherNode = data.nodes.find(n => n.id === otherNodeId);
        
        if (!otherNode) return null;

        return (
          <Link key={edge.id} href={`/entity/${otherNode.slug}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
            <Card className="bg-card/40 hover:bg-accent/10 transition-colors border-border/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-1 flex items-center gap-1">
                    <ArrowRightLeft className="w-3 h-3" />
                    {!isOutgoing && "Incoming: "} {edge.label.replace(/_/g, ' ')}
                  </p>
                  <p className="font-medium">{otherNode.title}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
