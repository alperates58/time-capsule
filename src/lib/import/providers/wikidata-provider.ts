import { ImportSourceProvider, ProviderInfo, ProviderFetchResult } from "./provider";
import { fetchWikidata } from "../sources/wikidata/client";
import { getEventsByYear, getFilmsByYear, getBirthsByYear, getDeathsByYear } from "../sources/wikidata/queries";
import { normalizeWikidataResult } from "../sources/wikidata/normalizer";
import { runManualImport } from "../import-runner";
import { ImportPayload, NormalizedEntity } from "../types";
import { EntityType } from "@prisma/client";

export class WikidataProvider implements ImportSourceProvider {
  readonly id = "WIKIDATA";

  getProviderInfo(): ProviderInfo {
    return {
      name: "Wikidata",
      baseUrl: "https://query.wikidata.org/sparql",
      license: "CC0",
      attributionRequired: true
    };
  }

  getTrustLevel(): number {
    return 80;
  }

  getRateLimit(): number {
    return 1000;
  }

  supports(type: string): boolean {
    return ["events", "films", "births", "deaths"].includes(type);
  }

  normalize(rawPayload: any, targetTypeStr?: string): NormalizedEntity | null {
    // Basic fallback if targetType isn't passed directly via fetch
    const targetType = targetTypeStr as EntityType || EntityType.OTHER;
    return normalizeWikidataResult(rawPayload, targetType);
  }

  async fetch(year: number, type: string, limit: number, dryRun: boolean = false): Promise<ProviderFetchResult> {
    if (!this.supports(type)) {
      return { success: false, importedEntities: 0, skipped: 0, errors: [`Unsupported wikidata type: ${type}`] };
    }

    let query = "";
    let targetType: EntityType = EntityType.OTHER;

    switch (type) {
      case "events":
        query = getEventsByYear(year, limit);
        targetType = EntityType.EVENT;
        break;
      case "films":
        query = getFilmsByYear(year, limit);
        targetType = EntityType.MOVIE;
        break;
      case "births":
        query = getBirthsByYear(year, limit);
        targetType = EntityType.PERSON;
        break;
      case "deaths":
        query = getDeathsByYear(year, limit);
        targetType = EntityType.PERSON;
        break;
    }

    console.log(`[${this.id}] Fetching ${limit} ${type} for year ${year}...`);
    
    try {
      const bindings = await fetchWikidata(query);
      
      console.log(`[${this.id}] Received ${bindings.length} results. Normalizing...`);
      
      const entities: NormalizedEntity[] = [];
      
      for (const binding of bindings) {
        const entity = this.normalize(binding, targetType);
        if (entity) {
          entities.push(entity);
        }
      }

      console.log(`[${this.id}] Normalized to ${entities.length} valid entities.`);
      
      if (entities.length === 0) {
        return { success: true, importedEntities: 0, skipped: bindings.length, errors: [] };
      }

      const payload: ImportPayload = { entities };

      if (dryRun) {
        console.log(`[DRY-RUN] [${this.id}] Would have routed ${entities.length} entities to Import Engine. Database untouched.`);
        return { success: true, importedEntities: entities.length, skipped: bindings.length - entities.length, errors: [] };
      }

      console.log(`[${this.id}] Routing through TimeCapsule Import Engine...`);
      const result = await runManualImport(this.id, payload);
      
      if (result.errors.length > 0) {
        console.log(`[${this.id}] Errors:`, result.errors);
      }

      return {
        success: result.success,
        importedEntities: result.importedEntities,
        skipped: bindings.length - entities.length,
        errors: result.errors
      };
      
    } catch (err: any) {
      console.error(`[${this.id}] Import Failed:`, err.message);
      return { success: false, importedEntities: 0, skipped: 0, errors: [err.message] };
    }
  }
}
