import { Entity } from "@prisma/client";
import { Calendar, Tag } from "lucide-react";

interface EntityMetadataProps {
  entity: Entity;
}

export function EntityMetadata({ entity }: EntityMetadataProps) {
  return (
    <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-8">
      {entity.type && (
        <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-md border border-border/50">
          <Tag className="w-4 h-4" />
          <span className="font-semibold uppercase tracking-wider text-xs">{entity.type}</span>
        </div>
      )}
      
      {entity.startDate && (
        <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-md border border-border/50">
          <Calendar className="w-4 h-4" />
          <span>
            {entity.startDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            {entity.endDate ? ` - ${entity.endDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}
          </span>
        </div>
      )}

      {entity.status && (
        <div className="flex items-center gap-2 bg-muted/50 px-3 py-1.5 rounded-md border border-border/50">
          <span className="font-medium capitalize">{entity.status.toLowerCase().replace('_', ' ')}</span>
        </div>
      )}
    </div>
  );
}
