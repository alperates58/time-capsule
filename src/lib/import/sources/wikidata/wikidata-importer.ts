import { fetchWikidata } from "./client";
import { getEventsByYear, getFilmsByYear, getBirthsByYear, getDeathsByYear } from "./queries";
import { normalizeWikidataResult } from "./normalizer";
import { runManualImport } from "../../import-runner";
import { ImportPayload, NormalizedEntity } from "../../types";
import { EntityType } from "@prisma/client";

export async function importFromWikidata(year: number, type: string, limit: number) {
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
    default:
      throw new Error(`Unsupported wikidata type: ${type}`);
  }

  console.log(`Fetching ${limit} ${type} for year ${year} from Wikidata...`);
  
  try {
    const bindings = await fetchWikidata(query);
    
    console.log(`Received ${bindings.length} results. Normalizing...`);
    
    const entities: NormalizedEntity[] = [];
    
    for (const binding of bindings) {
      const entity = normalizeWikidataResult(binding, targetType);
      if (entity) {
        entities.push(entity);
      }
    }

    console.log(`Normalized to ${entities.length} valid entities (filtered missing labels/descriptions).`);
    
    if (entities.length === 0) {
      console.log("No valid entities to import.");
      return;
    }

    const payload: ImportPayload = {
      entities
    };

    console.log("Routing through TimeCapsule Import Engine...");
    const result = await runManualImport("WIKIDATA", payload);
    
    console.log(`Import Result: ${result.success ? 'Success' : 'Partial/Fail'}`);
    console.log(`Imported Entities: ${result.importedEntities}`);
    if (result.errors.length > 0) {
      console.log("Errors:");
      console.log(result.errors);
    }
    
  } catch (err: any) {
    console.error("Wikidata Import Failed:", err.message);
  }
}
