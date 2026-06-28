import { ImportSourceProvider, ProviderInfo, ProviderFetchResult } from "./provider";
import { NormalizedEntity } from "../types";

export class IGDBProvider implements ImportSourceProvider {
  readonly id = "IGDB";

  getProviderInfo(): ProviderInfo {
    return {
      name: "Internet Game Database (IGDB)",
      baseUrl: "https://api.igdb.com/v4",
      attributionRequired: true
    };
  }

  getTrustLevel(): number { return 85; }
  getRateLimit(): number { return 250; } // 4 requests per second

  supports(type: string): boolean {
    return ["games", "platforms"].includes(type);
  }

  normalize(rawPayload: any): NormalizedEntity | null {
    throw new Error("IGDB normalizer not implemented yet.");
  }

  async fetch(year: number, type: string, limit: number, dryRun: boolean = false): Promise<ProviderFetchResult> {
    throw new Error("IGDB Provider not implemented. Stub only. Will require Twitch OAuth.");
  }
}
