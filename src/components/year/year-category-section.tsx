import { YearEntityCard } from "./year-entity-card";

interface YearCategorySectionProps {
  categoryName: string;
  entities: any[];
}

export function YearCategorySection({ categoryName, entities }: YearCategorySectionProps) {
  if (!entities || entities.length === 0) return null;

  return (
    <section className="scroll-mt-24" id={`category-${categoryName.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-3xl font-bold tracking-tight">{categoryName}</h2>
        <div className="h-px bg-border/50 flex-1 mt-2" />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {entities.map(entity => (
          <YearEntityCard key={entity.id} entity={entity} />
        ))}
      </div>
    </section>
  );
}
