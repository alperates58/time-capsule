import { Entity, EntityType, DatePrecision, YearProfile, Category } from "@prisma/client";

// Extended entity type including relations for builder calculations
export type BuilderEntity = Entity & {
  incomingRelationsCount?: number;
  isStartedInTargetYear?: boolean;
};

export interface NavigationAnchor {
  id: string;
  label: string;
}

export interface YearTheme {
  themeName: string;
  heroTitle?: string;
  heroSubtitle?: string;
  designTokens: Record<string, any>;
  editorialSummary?: string;
}

export interface YearCategory {
  slug: string;
  name: string;
  description?: string;
  entities: BuilderEntity[];
}

export interface YearHighlights {
  events: BuilderEntity[];
  people: BuilderEntity[];
  movies: BuilderEntity[];
  games: BuilderEntity[];
  tech: BuilderEntity[];
}

export interface YearPageData {
  year: number;
  theme: YearTheme;
  navigation: NavigationAnchor[];
  hero: BuilderEntity | null;
  timeline: BuilderEntity[];
  highlights: YearHighlights;
  categories: YearCategory[];
}
