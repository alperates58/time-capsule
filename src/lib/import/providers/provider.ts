import { NormalizedEntity } from "../types";

export interface ProviderInfo {
  name: string;
  baseUrl: string;
  license?: string;
  attributionRequired: boolean;
}

export interface ProviderFetchResult {
  success: boolean;
  importedEntities: number;
  skipped: number;
  errors: string[];
}

export interface ImportSourceProvider {
  /** Uniquely identifies this provider (e.g., 'WIKIDATA', 'TMDB') */
  readonly id: string;
  
  /** Metadata about the data source */
  getProviderInfo(): ProviderInfo;
  
  /** How reliable is this source (1-100) */
  getTrustLevel(): number;
  
  /** Recommended delay between requests in ms */
  getRateLimit(): number;
  
  /** Check if this provider supports importing a certain type (e.g. 'films', 'events') */
  supports(type: string): boolean;
  
  /**
   * Fetches data for the given year, normalizes it, and optionally runs it through the Import Engine.
   * If dryRun is true, it does not mutate the database.
   */
  fetch(year: number, type: string, limit: number, dryRun?: boolean): Promise<ProviderFetchResult>;
  
  /**
   * Raw payload normalization. 
   * This is exposed in case we want to parse raw payloads fetched outside the 'fetch' method.
   */
  normalize(rawPayload: any, targetType?: string): NormalizedEntity | null;
}
