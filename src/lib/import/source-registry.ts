import { SourceType } from "@prisma/client";

export const SourceRegistry = {
  WIKIPEDIA: { type: SourceType.WIKIPEDIA, trustLevel: 80 },
  WIKIDATA: { type: SourceType.WIKIDATA, trustLevel: 90 },
  MANUAL: { type: SourceType.MANUAL, trustLevel: 100 },
  TMDB: { type: SourceType.TMDB, trustLevel: 85 },
  OTHER: { type: SourceType.OTHER, trustLevel: 50 },
} as const;

export function getSourceConfig(name: string) {
  const upper = name.toUpperCase() as keyof typeof SourceRegistry;
  return SourceRegistry[upper] || SourceRegistry.OTHER;
}
