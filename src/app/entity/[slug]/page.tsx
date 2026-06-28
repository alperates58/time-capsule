import { getEntityDetailPageData } from "@/lib/timecapsule";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { EntityNotFound } from "@/components/entity/entity-not-found";
import { EntityHero } from "@/components/entity/entity-hero";
import { EntityMetadata } from "@/components/entity/entity-metadata";
import { EntityCategoryList } from "@/components/entity/entity-category-list";
import { EntityRelationList } from "@/components/entity/entity-relation-list";
import { EntitySourceNote } from "@/components/entity/entity-source-note";
import { KnowledgeGraph } from "@/components/graph/knowledge-graph";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const data = await getEntityDetailPageData(params.slug);
  
  if (!data || !data.entity) {
    return {
      title: "Entity Not Found | TimeCapsule",
      robots: { index: false, follow: false }
    };
  }

  const { entity } = data;
  return {
    title: `${entity.title} - TimeCapsule`,
    description: entity.description || entity.subtitle || `Learn about ${entity.title} on TimeCapsule.`,
    openGraph: {
      title: `${entity.title} - TimeCapsule`,
      description: entity.description || entity.subtitle || `Learn about ${entity.title} on TimeCapsule.`,
    },
    robots: { index: true, follow: true }
  };
}

export default async function EntityPage({ params }: PageProps) {
  const data = await getEntityDetailPageData(params.slug);
  
  if (!data || !data.entity) {
    return <EntityNotFound slug={params.slug} />;
  }

  const { entity, relations, categories, sources } = data;
  const yearNumber = entity.startDate?.getFullYear();
  const is1998 = yearNumber === 1998;

  return (
    <div className="animate-fade-in-up pb-24">
      {/* Contextual Nav */}
      <div className="py-4 px-6 max-w-4xl mx-auto border-b border-border/40 mb-8">
        <Link 
          href={is1998 ? "/1998" : `/${yearNumber || ''}`}
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to {yearNumber || 'Timeline'}
        </Link>
      </div>

      <EntityHero entity={entity} />
      
      <div className="max-w-4xl mx-auto px-6 mt-12 space-y-16">
        <EntityMetadata entity={entity} />
        
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-16">
            <EntityRelationList relations={relations} />
          </div>
          
          <div className="space-y-12">
            <EntityCategoryList categories={categories} />
            <EntitySourceNote sources={sources} />
          </div>
        </div>
      </div>

      <KnowledgeGraph slug={params.slug} />
    </div>
  );
}
