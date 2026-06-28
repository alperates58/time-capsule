import { ImportSourceProvider, ProviderInfo, ProviderFetchResult } from "./provider";
import { NormalizedEntity } from "../types";

export class TMDBProvider implements ImportSourceProvider {
  readonly id = "TMDB";

  getProviderInfo(): ProviderInfo {
    return {
      name: "The Movie Database (TMDB)",
      baseUrl: "https://api.themoviedb.org/3",
      attributionRequired: true
    };
  }

  getTrustLevel(): number { return 90; }
  getRateLimit(): number { return 250; } // e.g., 40 requests per 10 seconds

  supports(type: string): boolean {
    return ["films", "series"].includes(type);
  }

  normalize(rawPayload: any): NormalizedEntity | null {
    throw new Error("TMDB normalizer not implemented yet.");
  }

  async fetch(year: number, type: string, limit: number, dryRun: boolean = false): Promise<ProviderFetchResult> {
    throw new Error("TMDB Provider not implemented. Stub only. Will require /discover/movie API.");
  }
}
