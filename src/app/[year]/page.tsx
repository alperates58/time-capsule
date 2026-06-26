import { getYearProfile, getEntitiesByCategoryForYear } from "@/lib/timecapsule";
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    year: string;
  };
}

export default async function YearPage({ params }: PageProps) {
  const yearNumber = parseInt(params.year, 10);
  
  if (isNaN(yearNumber)) {
    notFound();
  }

  const profile = await getYearProfile(yearNumber);
  if (!profile) {
    notFound();
  }

  const categories = await getEntitiesByCategoryForYear(yearNumber);

  return (
    <div className="container max-w-5xl mx-auto py-12 px-6 animate-fade-in-up">
      
      {/* Golden Sample Year Banner */}
      <div className="mb-8 p-4 bg-primary/10 border border-primary/20 rounded-lg text-center text-sm font-medium text-primary">
        Phase 6: Golden Sample Year ({yearNumber}) — DB Driven
      </div>

      <header className="mb-16 text-center space-y-4">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          {profile.heroTitle}
        </h1>
        {profile.heroSubtitle && (
          <p className="text-xl md:text-2xl text-muted-foreground font-light text-balance">
            {profile.heroSubtitle}
          </p>
        )}
        {profile.editorialSummary && (
          <p className="mt-6 max-w-2xl mx-auto text-muted-foreground leading-relaxed">
            {profile.editorialSummary}
          </p>
        )}
      </header>

      <div className="space-y-16">
        {Object.entries(categories).map(([categoryName, entities]) => (
          <section key={categoryName}>
            <h2 className="text-3xl font-bold tracking-tight border-b border-border/50 pb-4 mb-6">
              {categoryName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {entities.map(entity => (
                <Card key={entity.id} className="bg-card/50 backdrop-blur border-border/50 hover:bg-accent/5 transition-colors">
                  <CardContent className="p-6 flex flex-col gap-2">
                    <h3 className="text-lg font-semibold tracking-tight">{entity.title}</h3>
                    {entity.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {entity.description}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{entity.startDate?.toLocaleDateString()}</span>
                      {entity.sourceReferences && entity.sourceReferences.length > 0 && (
                        <span className="bg-muted px-2 py-1 rounded">
                          {entity.sourceReferences[0].source.name}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
