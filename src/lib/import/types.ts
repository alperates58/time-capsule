import { EntityType, RelationType, DatePrecision } from "@prisma/client";

export interface NormalizedEntity {
  slug: string;
  type: EntityType;
  title: string;
  subtitle?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  precision?: DatePrecision;
  metadata?: Record<string, any>;
  aliases?: string[];
}

export interface NormalizedRelation {
  fromSlug: string;
  toSlug: string;
  relationType: RelationType;
  startDate?: string;
  endDate?: string;
}

export interface NormalizedCategory {
  slug: string;
  name: string;
  description?: string;
  parentSlug?: string;
}

export interface NormalizedEntityCategory {
  entitySlug: string;
  categorySlug: string;
}

export interface NormalizedSource {
  name: string;
  url?: string;
  citationText?: string;
}

export interface ImportPayload {
  entities?: NormalizedEntity[];
  relations?: NormalizedRelation[];
  categories?: NormalizedCategory[];
  entityCategories?: NormalizedEntityCategory[];
}

export interface ImportJobResult {
  success: boolean;
  importedEntities: number;
  importedRelations: number;
  importedCategories: number;
  errors: string[];
}
