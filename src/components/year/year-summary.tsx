import { YearProfile } from "@prisma/client";

interface YearSummaryProps {
  profile: YearProfile;
}

export function YearSummary({ profile }: YearSummaryProps) {
  if (!profile.editorialSummary) return null;

  return (
    <section className="max-w-3xl mx-auto px-6 py-12">
      <div className="prose prose-lg dark:prose-invert prose-p:leading-relaxed prose-p:text-muted-foreground mx-auto text-center text-balance">
        <p className="text-xl font-medium text-foreground">
          {profile.editorialSummary}
        </p>
      </div>
    </section>
  );
}
