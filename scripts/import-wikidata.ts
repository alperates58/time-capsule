import { ProviderRegistry } from '../src/lib/import/providers/provider-registry';

async function main() {
  const args = process.argv.slice(2);
  let year = 1998;
  let type = "events";
  let limit = 20;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--year" && args[i + 1]) {
      year = parseInt(args[i + 1], 10);
    }
    if (args[i] === "--type" && args[i + 1]) {
      type = args[i + 1];
    }
    if (args[i] === "--limit" && args[i + 1]) {
      limit = parseInt(args[i + 1], 10);
    }
  }

  const supportedTypes = ["events", "films", "births", "deaths"];
  if (!supportedTypes.includes(type)) {
    console.error(`Invalid type: ${type}. Supported types: ${supportedTypes.join(", ")}`);
    process.exit(1);
  }

  console.log("==========================================");
  console.log(` Starting Wikidata Import Prototype`);
  console.log(` Target: ${type} for year ${year}`);
  console.log(` Limit:  ${limit} records max`);
  console.log("==========================================\n");

  const provider = ProviderRegistry.getProvider("WIKIDATA");
  await provider.fetch(year, type, limit, false);
}

main().catch(err => {
  console.error("Fatal Error during Wikidata import:", err);
  process.exit(1);
});
