import { BuilderEntity } from "./types";
import { EntityType } from "@prisma/client";

export function calculateEntityScore(entity: BuilderEntity, primaryEventEntityId?: string | null): number {
  let score = 0;

  // 1. Base Score by Type (Favor culturally significant types)
  const highImpactTypes: EntityType[] = [EntityType.EVENT, EntityType.TECHNOLOGY, EntityType.SOFTWARE, EntityType.CONSOLE];
  const mediumImpactTypes: EntityType[] = [EntityType.MOVIE, EntityType.GAME, EntityType.ALBUM];
  
  if (highImpactTypes.includes(entity.type)) score += 20;
  else if (mediumImpactTypes.includes(entity.type)) score += 10;
  else score += 5;

  // 2. Relation connectedness
  if (entity.incomingRelationsCount) {
    score += (entity.incomingRelationsCount * 2);
  }

  // 3. Multiplier for starting in the target year
  if (entity.isStartedInTargetYear) {
    score *= 1.5;
  }

  // 4. Ultimate priority if explicitly selected by editor
  if (primaryEventEntityId && entity.id === primaryEventEntityId) {
    score += 500;
  }

  return Math.round(score);
}

export function selectHero(entities: BuilderEntity[], primaryEventEntityId?: string | null): BuilderEntity | null {
  if (entities.length === 0) return null;

  let bestEntity = entities[0];
  let maxScore = -1;

  for (const entity of entities) {
    const score = calculateEntityScore(entity, primaryEventEntityId);
    if (score > maxScore) {
      maxScore = score;
      bestEntity = entity;
    }
  }

  return bestEntity;
}
