import { PrismaClient, YearProfile } from '@prisma/client';

const prisma = new PrismaClient();

export async function getYearProfile(year: number) {
  return await prisma.yearProfile.findUnique({
    where: { year },
  });
}

export async function getEntitiesForYear(year: number) {
  const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
  const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);

  return await prisma.entity.findMany({
    where: {
      startDate: {
        gte: startOfYear,
        lte: endOfYear,
      },
    },
    include: {
      categories: {
        include: {
          category: true,
        },
      },
      sourceReferences: {
        include: {
          source: true,
        },
      },
    },
    orderBy: {
      startDate: 'asc',
    },
  });
}

export function groupEntitiesByCategory(entities: any[]) {
  const grouped: Record<string, typeof entities> = {};

  for (const entity of entities) {
    if (entity.categories.length === 0) {
      if (!grouped['Uncategorized']) grouped['Uncategorized'] = [];
      grouped['Uncategorized'].push(entity);
      continue;
    }

    for (const ec of entity.categories) {
      const catName = ec.category.name;
      if (!grouped[catName]) {
        grouped[catName] = [];
      }
      grouped[catName].push(entity);
    }
  }

  return grouped;
}

export async function getYearHighlights(year: number) {
  // Simplistic approach: pick up to 5 entities that have sources attached (proxy for importance in seed)
  const all = await getEntitiesForYear(year);
  return all.slice(0, 5);
}

export async function getYearPageData(year: number) {
  const profile = await getYearProfile(year);
  if (!profile) return null;

  const rawEntities = await getEntitiesForYear(year);
  const categories = groupEntitiesByCategory(rawEntities);
  const highlights = await getYearHighlights(year);

  return {
    profile,
    categories,
    highlights,
    entityCount: rawEntities.length
  };
}

export function getPrimaryThemeTokens(profile: YearProfile | null) {
  const defaultTokens = { primaryColor: "hsl(var(--primary))", secondaryColor: "hsl(var(--secondary))" };
  if (!profile || !profile.designTokens) return defaultTokens;
  
  const tokens = profile.designTokens as Record<string, string>;
  return {
    primaryColor: tokens.primaryColor || defaultTokens.primaryColor,
    secondaryColor: tokens.secondaryColor || defaultTokens.secondaryColor,
  };
}

export async function getEntityBySlug(slug: string) {
  return await prisma.entity.findUnique({
    where: { slug }
  });
}

export async function getEntityRelations(entityId: string) {
  // Fetch relations where this entity is either from or to
  const fromRelations = await prisma.entityRelation.findMany({
    where: { fromEntityId: entityId },
    include: { toEntity: true, sourceReference: { include: { source: true } } }
  });
  
  const toRelations = await prisma.entityRelation.findMany({
    where: { toEntityId: entityId },
    include: { fromEntity: true, sourceReference: { include: { source: true } } }
  });

  return { fromRelations, toRelations };
}

export async function getEntityCategories(entityId: string) {
  return await prisma.entityCategory.findMany({
    where: { entityId },
    include: { category: true }
  });
}

export async function getEntitySources(entityId: string) {
  return await prisma.sourceReference.findMany({
    where: { entityId },
    include: { source: true }
  });
}

export async function getEntityDetailPageData(slug: string) {
  const entity = await getEntityBySlug(slug);
  if (!entity) return null;

  const [relations, categories, sources] = await Promise.all([
    getEntityRelations(entity.id),
    getEntityCategories(entity.id),
    getEntitySources(entity.id)
  ]);

  return {
    entity,
    relations,
    categories,
    sources
  };
}
