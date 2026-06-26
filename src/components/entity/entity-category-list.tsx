import Link from "next/link";
import { Folder } from "lucide-react";

interface EntityCategoryListProps {
  categories: any[];
}

export function EntityCategoryList({ categories }: EntityCategoryListProps) {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold tracking-tight uppercase text-muted-foreground flex items-center gap-2">
        <Folder className="w-4 h-4" /> Categories
      </h3>
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <div key={c.id} className="bg-secondary/20 text-secondary-foreground px-3 py-1 text-sm rounded-md border border-secondary/30">
            {c.category.name}
          </div>
        ))}
      </div>
    </div>
  );
}
