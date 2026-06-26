import { Info } from "lucide-react";

interface EntitySourceNoteProps {
  sources: any[];
}

export function EntitySourceNote({ sources }: EntitySourceNoteProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold tracking-tight uppercase text-muted-foreground flex items-center gap-2">
        <Info className="w-4 h-4" /> Data Sources
      </h3>
      <ul className="space-y-2">
        {sources.map((s) => (
          <li key={s.id} className="text-sm text-muted-foreground flex flex-col gap-1 bg-muted/30 p-3 rounded-lg border border-border/40">
            <span className="font-semibold text-foreground/80">{s.source.name}</span>
            {s.citationText && <span className="italic">&quot;{s.citationText}&quot;</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
