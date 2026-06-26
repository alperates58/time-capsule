import { Info } from "lucide-react";

interface YearSourceNoteProps {
  sourceReferences?: any[];
}

export function YearSourceNote({ sourceReferences }: YearSourceNoteProps) {
  if (!sourceReferences || sourceReferences.length === 0) return null;

  const sourceName = sourceReferences[0]?.source?.name;
  if (!sourceName) return null;

  return (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-muted/50 rounded-md text-[10px] uppercase font-semibold tracking-wider text-muted-foreground" title="Source Data">
      <Info className="w-3 h-3" />
      <span>{sourceName}</span>
    </div>
  );
}
