import { getYearPageData } from "@/lib/timecapsule";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { YearHero } from "@/components/year/year-hero";
import { YearSummary } from "@/components/year/year-summary";
import { YearHighlights } from "@/components/year/year-highlights";
import { YearCategorySection } from "@/components/year/year-category-section";
import { Breadcrumb } from "@/components/navigation/breadcrumb";
import { YearNavigation } from "@/components/navigation/year-navigation";

import { DiscoveryCTA } from "@/components/navigation/discovery-cta";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    year: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const yearNumber = parseInt(params.year, 10);
  if (isNaN(yearNumber)) return { title: "Not Found" };

  const data = await getYearPageData(yearNumber);
  if (!data || !data.profile) return { 
    title: `${yearNumber} | TimeCapsule`,
    robots: { index: false, follow: false }
  };

  return {
    title: `${data.profile.heroTitle} - TimeCapsule`,
    description: data.profile.editorialSummary || `Explore the events and culture of ${yearNumber}.`,
    openGraph: {
      title: `${data.profile.heroTitle} - TimeCapsule`,
      description: data.profile.editorialSummary || `Explore the events and culture of ${yearNumber}.`,
    },
    robots: {
      index: true,
      follow: true,
    }
  };
}

export default async function YearPage({ params }: PageProps) {
  const yearNumber = parseInt(params.year, 10);
  
  if (isNaN(yearNumber)) {
    notFound();
  }

  const data = await getYearPageData(yearNumber);
  
  // Empty State / Coming Soon
  if (!data || !data.profile) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 animate-fade-in-up">
        <h1 className="text-7xl md:text-9xl font-extrabold tracking-tighter text-muted-foreground/30 mb-6">
          {yearNumber}
        </h1>
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
          Data Not Yet Curated
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-12">
          We haven&apos;t built the TimeCapsule for {yearNumber} yet. Our curators and systems are constantly ingesting history. Check back soon.
        </p>
        <DiscoveryCTA />
      </div>
    );
  }

  const { profile, categories, highlights } = data;

  return (
    <div className="animate-fade-in-up pb-12">
      <Breadcrumb year={yearNumber} />
      
      <YearHero profile={profile} />
      <YearSummary profile={profile} />
      <YearHighlights highlights={highlights} />
      
      <div className="max-w-6xl mx-auto px-6 mt-24 space-y-24 mb-24">
        {Object.entries(categories).map(([categoryName, entities]) => (
          <YearCategorySection key={categoryName} categoryName={categoryName} entities={entities as any[]} />
        ))}
      </div>

      <YearNavigation currentYear={yearNumber} />
    </div>
  );
}
