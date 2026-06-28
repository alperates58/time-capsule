import { BuilderEntity, YearHighlights } from "./types";
import { EntityType } from "@prisma/client";
import { calculateEntityScore } from "./hero-selector";

export function buildHighlights(entities: BuilderEntity[]): YearHighlights {
  const scoredEntities = entities.map(e => ({
    entity: e,
    score: calculateEntityScore(e)
  })).sort((a, b) => b.score - a.score);

  const getTop10 = (types: EntityType[]) => {
    return scoredEntities
      .filter(se => types.includes(se.entity.type))
      .slice(0, 10)
      .map(se => se.entity);
  };

  return {
    events: getTop10([EntityType.EVENT]),
    people: getTop10([EntityType.PERSON]),
    movies: getTop10([EntityType.MOVIE, EntityType.TV_SERIES, EntityType.ANIME]),
    games: getTop10([EntityType.GAME]),
    tech: getTop10([EntityType.TECHNOLOGY, EntityType.SOFTWARE, EntityType.CONSOLE, EntityType.PHONE])
  };
}
