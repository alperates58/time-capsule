import { PrismaClient } from '@prisma/client';

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

export async function getEntitiesByCategoryForYear(year: number) {
  const entities = await getEntitiesForYear(year);

  // Group by category name
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

export async function getFeaturedYearEntities(year: number) {
  const startOfYear = new Date(`${year}-01-01T00:00:00.000Z`);
  const endOfYear = new Date(`${year}-12-31T23:59:59.999Z`);
  
  return await prisma.entity.findMany({
    where: {
      startDate: {
        gte: startOfYear,
        lte: endOfYear,
      },
    },
    take: 5,
    orderBy: {
      startDate: 'desc', // Just a simplistic featured logic for now
    },
  });
}
