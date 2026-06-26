import { Entity } from "@prisma/client";

interface EntityHeroProps {
  entity: Entity;
}

export function EntityHero({ entity }: EntityHeroProps) {
  return (
    <section className="py-16 md:py-24 px-6 border-b border-border/40 bg-muted/10">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-balance">
          {entity.title}
        </h1>
        {entity.subtitle && (
          <p className="text-xl md:text-2xl text-muted-foreground font-medium text-balance">
            {entity.subtitle}
          </p>
        )}
        {entity.description && (
          <p className="text-lg text-foreground/80 leading-relaxed max-w-3xl mt-6">
            {entity.description}
          </p>
        )}
      </div>
    </section>
  );
}
