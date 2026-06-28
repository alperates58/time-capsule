import { ImportSourceProvider, ProviderInfo, ProviderFetchResult } from "./provider";
import { NormalizedEntity } from "../types";

export class NASAProvider implements ImportSourceProvider {
  readonly id = "NASA";

  getProviderInfo(): ProviderInfo {
    return {
      name: "NASA Open APIs",
      baseUrl: "https://api.nasa.gov",
      attributionRequired: false
    };
  }

  getTrustLevel(): number { return 95; }
  getRateLimit(): number { return 2000; }

  supports(type: string): boolean {
    return ["space_missions", "discoveries"].includes(type);
  }

  normalize(rawPayload: any): NormalizedEntity | null {
    throw new Error("NASA normalizer not implemented yet.");
  }

  async fetch(year: number, type: string, limit: number, dryRun: boolean = false): Promise<ProviderFetchResult> {
    throw new Error("NASA Provider not implemented. Stub only.");
  }
}
