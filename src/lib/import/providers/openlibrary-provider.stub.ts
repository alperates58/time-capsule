import { ImportSourceProvider, ProviderInfo, ProviderFetchResult } from "./provider";
import { NormalizedEntity } from "../types";

export class OpenLibraryProvider implements ImportSourceProvider {
  readonly id = "OPENLIBRARY";

  getProviderInfo(): ProviderInfo {
    return {
      name: "OpenLibrary",
      baseUrl: "https://openlibrary.org",
      attributionRequired: true
    };
  }

  getTrustLevel(): number { return 70; }
  getRateLimit(): number { return 1000; }

  supports(type: string): boolean {
    return ["books", "authors"].includes(type);
  }

  normalize(rawPayload: any): NormalizedEntity | null {
    throw new Error("OpenLibrary normalizer not implemented yet.");
  }

  async fetch(year: number, type: string, limit: number, dryRun: boolean = false): Promise<ProviderFetchResult> {
    throw new Error("OpenLibrary Provider not implemented. Stub only.");
  }
}
