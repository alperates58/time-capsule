import { ImportSourceProvider } from "./provider";

class Registry {
  private providers: Map<string, ImportSourceProvider> = new Map();

  register(provider: ImportSourceProvider) {
    if (this.providers.has(provider.id)) {
      console.warn(`Provider ${provider.id} is already registered. Overwriting.`);
    }
    this.providers.set(provider.id, provider);
  }

  getProvider(id: string): ImportSourceProvider {
    const provider = this.providers.get(id);
    if (!provider) {
      throw new Error(`Provider not found: ${id}`);
    }
    return provider;
  }

  getAllProviders(): ImportSourceProvider[] {
    return Array.from(this.providers.values());
  }

  getProvidersForType(type: string): ImportSourceProvider[] {
    return this.getAllProviders().filter(p => p.supports(type));
  }
}

// Singleton export
export const ProviderRegistry = new Registry();

// Auto-register available providers
import { WikidataProvider } from "./wikidata-provider";
ProviderRegistry.register(new WikidataProvider());
