import { ImportSourceProvider, ProviderInfo, ProviderFetchResult } from "./provider";
import { NormalizedEntity } from "../types";

export class MusicBrainzProvider implements ImportSourceProvider {
  readonly id = "MUSICBRAINZ";

  getProviderInfo(): ProviderInfo {
    return {
      name: "MusicBrainz",
      baseUrl: "https://musicbrainz.org/ws/2",
      attributionRequired: true
    };
  }

  getTrustLevel(): number { return 85; }
  getRateLimit(): number { return 1000; } // MusicBrainz requires 1 req/sec

  supports(type: string): boolean {
    return ["albums", "songs", "artists"].includes(type);
  }

  normalize(rawPayload: any): NormalizedEntity | null {
    throw new Error("MusicBrainz normalizer not implemented yet.");
  }

  async fetch(year: number, type: string, limit: number, dryRun: boolean = false): Promise<ProviderFetchResult> {
    throw new Error("MusicBrainz Provider not implemented. Stub only. Will require XML or JSON endpoints.");
  }
}
