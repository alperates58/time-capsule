import { Card, CardContent } from "@/components/ui/card";
import { YearSourceNote } from "./year-source-note";
import Link from "next/link";

interface YearEntityCardProps {
  entity: any;
}

export function YearEntityCard({ entity }: YearEntityCardProps) {
  return (
    <Link href={`/entity/${entity.slug}`} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xl">
      <Card className="group bg-card/50 backdrop-blur border-border/50 hover:bg-accent/5 hover:border-primary/30 transition-all duration-300 overflow-hidden h-full flex flex-col">
        <CardContent className="p-6 flex flex-col h-full gap-3 relative">
          
          {/* Subtle hover gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="flex-1 space-y-2 z-10">
            <h3 className="text-xl font-bold tracking-tight group-hover:text-primary transition-colors">
              {entity.title}
            </h3>
            {entity.subtitle && (
              <p className="text-sm font-medium text-foreground/80">
                {entity.subtitle}
              </p>
            )}
            {entity.description && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {entity.description}
              </p>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-xs text-muted-foreground z-10">
            <time dateTime={entity.startDate?.toISOString()}>
              {entity.startDate?.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
            </time>
            <YearSourceNote sourceReferences={entity.sourceReferences} />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
