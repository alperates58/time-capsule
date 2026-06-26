import { YearEntityCard } from "./year-entity-card";

interface YearHighlightsProps {
  highlights: any[];
}

export function YearHighlights({ highlights }: YearHighlightsProps) {
  if (!highlights || highlights.length === 0) return null;

  return (
    <section className="bg-muted/30 py-16 px-6 border-y border-border/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Year Defining Moments</h2>
          <p className="text-muted-foreground text-lg">The entities that shaped the cultural landscape.</p>
        </div>
        
        {/* Horizontal scroll on mobile, grid on desktop */}
        <div className="flex overflow-x-auto pb-8 -mx-6 px-6 lg:mx-0 lg:px-0 lg:grid lg:grid-cols-4 xl:grid-cols-5 gap-6 snap-x snap-mandatory">
          {highlights.map(entity => (
            <div key={entity.id} className="min-w-[280px] lg:min-w-0 snap-center">
              <YearEntityCard entity={entity} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
