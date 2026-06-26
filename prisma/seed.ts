import { PrismaClient, EntityType, EntityStatus, DatePrecision, RelationType, SourceType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Create Core Categories
  const categoryNames = [
    'Movies', 'Games', 'Music', 'Technology', 
    'World Events', 'People', 'Sports', 'Internet Culture', 
    'Science', 'Space', 'Books', 'Television'
  ];

  const categories: Record<string, any> = {};
  for (const name of categoryNames) {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    categories[name] = await prisma.category.upsert({
      where: { slug },
      update: {},
      create: { name, slug },
    });
  }

  // 2. Create Sources
  const sourcesData = [
    { name: 'Wikidata', type: SourceType.WIKIDATA, trustLevel: 80, baseUrl: 'https://www.wikidata.org' },
    { name: 'TMDB', type: SourceType.TMDB, trustLevel: 95, baseUrl: 'https://www.themoviedb.org' },
    { name: 'Wikipedia', type: SourceType.WIKIPEDIA, trustLevel: 70, baseUrl: 'https://en.wikipedia.org' },
    { name: 'MobyGames', type: SourceType.MOBYGAMES, trustLevel: 90, baseUrl: 'https://www.mobygames.com' },
  ];

  const sources: Record<string, any> = {};
  for (const source of sourcesData) {
    sources[source.name] = await prisma.source.upsert({
      where: { name: source.name },
      update: {},
      create: source,
    });
  }

  // Helper to create entity with category and source reference
  async function createEntityWithCategory(data: any, categoryName: string, sourceName: string) {
    const entity = await prisma.entity.upsert({
      where: { slug: data.slug },
      update: {},
      create: {
        ...data,
        sourceReferences: {
          create: [{ sourceId: sources[sourceName].id, confidence: 100, citationText: 'Manually seeded' }]
        },
        categories: {
          create: [{ categoryId: categories[categoryName].id, confidence: 100 }]
        }
      }
    });
    return entity;
  }

  // 3. Create YearProfile 1998
  await prisma.yearProfile.upsert({
    where: { year: 1998 },
    update: {},
    create: {
      year: 1998,
      themeName: "The Dawn of the Modern Internet Age",
      heroTitle: "1998",
      heroSubtitle: "When the web became part of our lives.",
      editorialSummary: "1998 marked a turning point in history with the founding of Google, the release of iconic games like Half-Life, and a cultural explosion that set the stage for the new millennium.",
      status: EntityStatus.PUBLISHED,
      designTokens: { primaryColor: "hsl(222, 47%, 11%)" },
    }
  });

  // 4. Seed Entities for 1998
  // Movies
  const titanic = await createEntityWithCategory({
    type: EntityType.MOVIE, slug: 'movie-titanic', title: 'Titanic',
    description: 'A 1997 American epic romance and disaster film directed by James Cameron. Dominated culture in 1998.',
    startDate: new Date('1997-12-19'), precision: DatePrecision.EXACT, status: EntityStatus.PUBLISHED,
  }, 'Movies', 'TMDB');

  const spr = await createEntityWithCategory({
    type: EntityType.MOVIE, slug: 'movie-saving-private-ryan', title: 'Saving Private Ryan',
    startDate: new Date('1998-07-24'), precision: DatePrecision.EXACT, status: EntityStatus.PUBLISHED,
  }, 'Movies', 'TMDB');

  const truman = await createEntityWithCategory({
    type: EntityType.MOVIE, slug: 'movie-the-truman-show', title: 'The Truman Show',
    startDate: new Date('1998-06-05'), precision: DatePrecision.EXACT, status: EntityStatus.PUBLISHED,
  }, 'Movies', 'TMDB');

  // Games
  const hl = await createEntityWithCategory({
    type: EntityType.GAME, slug: 'game-half-life', title: 'Half-Life',
    startDate: new Date('1998-11-19'), precision: DatePrecision.EXACT, status: EntityStatus.PUBLISHED,
  }, 'Games', 'MobyGames');

  const zelda = await createEntityWithCategory({
    type: EntityType.GAME, slug: 'game-zelda-oot', title: 'The Legend of Zelda: Ocarina of Time',
    startDate: new Date('1998-11-21'), precision: DatePrecision.EXACT, status: EntityStatus.PUBLISHED,
  }, 'Games', 'MobyGames');

  const mgs = await createEntityWithCategory({
    type: EntityType.GAME, slug: 'game-metal-gear-solid', title: 'Metal Gear Solid',
    startDate: new Date('1998-09-03'), precision: DatePrecision.EXACT, status: EntityStatus.PUBLISHED,
  }, 'Games', 'MobyGames');

  // Technology
  const google = await createEntityWithCategory({
    type: EntityType.COMPANY, slug: 'company-google', title: 'Google',
    startDate: new Date('1998-09-04'), precision: DatePrecision.EXACT, status: EntityStatus.PUBLISHED,
  }, 'Technology', 'Wikidata');

  const win98 = await createEntityWithCategory({
    type: EntityType.OS, slug: 'os-windows-98', title: 'Windows 98',
    startDate: new Date('1998-06-25'), precision: DatePrecision.EXACT, status: EntityStatus.PUBLISHED,
  }, 'Technology', 'Wikidata');

  const imac = await createEntityWithCategory({
    type: EntityType.TECHNOLOGY, slug: 'tech-imac-g3', title: 'iMac G3',
    startDate: new Date('1998-08-15'), precision: DatePrecision.EXACT, status: EntityStatus.PUBLISHED,
  }, 'Technology', 'Wikidata');

  // World Events
  const worldCup = await createEntityWithCategory({
    type: EntityType.EVENT, slug: 'event-1998-fifa-world-cup', title: '1998 FIFA World Cup',
    description: 'France won the 1998 FIFA World Cup.',
    startDate: new Date('1998-06-10'), endDate: new Date('1998-07-12'), precision: DatePrecision.EXACT, status: EntityStatus.PUBLISHED,
  }, 'World Events', 'Wikipedia');

  const iss = await createEntityWithCategory({
    type: EntityType.SPACE_MISSION, slug: 'space-iss-assembly', title: 'ISS Assembly Begins',
    description: 'The first module of the International Space Station, Zarya, is launched.',
    startDate: new Date('1998-11-20'), precision: DatePrecision.EXACT, status: EntityStatus.PUBLISHED,
  }, 'Space', 'Wikidata');

  // People
  const larry = await createEntityWithCategory({
    type: EntityType.PERSON, slug: 'person-larry-page', title: 'Larry Page',
    status: EntityStatus.PUBLISHED,
  }, 'People', 'Wikidata');

  const sergey = await createEntityWithCategory({
    type: EntityType.PERSON, slug: 'person-sergey-brin', title: 'Sergey Brin',
    status: EntityStatus.PUBLISHED,
  }, 'People', 'Wikidata');

  const france = await createEntityWithCategory({
    type: EntityType.COUNTRY, slug: 'country-france', title: 'France',
    status: EntityStatus.PUBLISHED,
  }, 'World Events', 'Wikidata');

  // 5. Create Relationships
  async function createRelation(fromId: string, toId: string, type: any, reason: string) {
    const existing = await prisma.entityRelation.findFirst({
      where: { fromEntityId: fromId, toEntityId: toId, relationType: type }
    });
    if (!existing) {
      const srcRef = await prisma.sourceReference.create({
        data: { sourceId: sources['Wikidata'].id, citationText: 'Manually seeded relation' }
      });
      await prisma.entityRelation.create({
        data: {
          fromEntityId: fromId,
          toEntityId: toId,
          relationType: type,
          metadata: { reason },
          sourceReferenceId: srcRef.id
        }
      });
    }
  }

  await createRelation(larry.id, google.id, RelationType.CREATED_BY, 'Co-founded Google');
  await createRelation(sergey.id, google.id, RelationType.CREATED_BY, 'Co-founded Google');
  await createRelation(worldCup.id, france.id, RelationType.OCCURS_IN, 'Hosted in France');
  await createRelation(france.id, worldCup.id, RelationType.WINNER_OF, 'France won the 1998 World Cup');

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
