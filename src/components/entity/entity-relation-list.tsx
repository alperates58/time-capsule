import Link from "next/link";
import { ArrowRightLeft, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface EntityRelationListProps {
  relations: {
    fromRelations: any[];
    toRelations: any[];
  };
}

export function EntityRelationList({ relations }: EntityRelationListProps) {
  const { fromRelations, toRelations } = relations;
  
  if (fromRelations.length === 0 && toRelations.length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold tracking-tight flex items-center gap-2 border-b border-border/50 pb-2">
        <ArrowRightLeft className="w-5 h-5 text-muted-foreground" /> Related Entities
      </h3>
      
      <div className="grid sm:grid-cols-2 gap-4">
        {fromRelations.map((rel) => (
          <Link key={rel.id} href={`/entity/${rel.toEntity.slug}`} className="block group outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
            <Card className="h-full bg-card/40 hover:bg-accent/10 transition-colors border-border/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">{rel.relationType}</p>
                  <p className="font-medium group-hover:text-primary transition-colors">{rel.toEntity.title}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
              </CardContent>
            </Card>
          </Link>
        ))}

        {toRelations.map((rel) => (
          <Link key={rel.id} href={`/entity/${rel.fromEntity.slug}`} className="block group outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
            <Card className="h-full bg-card/40 hover:bg-accent/10 transition-colors border-border/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold mb-1">Incoming: {rel.relationType}</p>
                  <p className="font-medium group-hover:text-primary transition-colors">{rel.fromEntity.title}</p>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
