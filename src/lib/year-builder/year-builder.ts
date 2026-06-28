import prisma from "../prisma";
import { YearPageData, BuilderEntity } from "./types";
import { buildTheme } from "./theme-builder";
import { selectHero } from "./hero-selector";
import { buildHighlights } from "./highlight-selector";
import { buildTimeline } from "./timeline-builder";
import { buildCategories } from "./category-builder";
import { buildNavigation } from "./navigation-builder";

export async function buildYearPageData(year: number): Promise<YearPageData> {
  const startOfYear = new Date(Date.UTC(year, 0, 1));
  const endOfYear = new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999));

  // 1. Fetch Year Profile
  const yearProfile = await prisma.yearProfile.findUnique({ where: { year } });

  // 2. Fetch all entities active in this year (either starting in it, or spanning across it)
  // We use a raw-like prisma query to get all overlapping entities.
  const rawEntities = await prisma.entity.findMany({
    where: {
      OR: [
        // Started this year
        { startDate: { gte: startOfYear, lte: endOfYear } },
        // Ended this year
        { endDate: { gte: startOfYear, lte: endOfYear } },
        // Started before and ended after (or ongoing)
        {
          startDate: { lt: startOfYear },
          OR: [
            { endDate: { gt: endOfYear } },
            { endDate: null }
          ]
        }
      ]
    },
    include: {
      _count: { select: { incomingRelations: true } },
      categories: {
        include: {
          category: true
        }
      }
    }
  });

  // Extract all categories flat map for the category builder
  const allEntityCategories = rawEntities.flatMap(e => e.categories.map(c => ({
    entityId: e.id,
    category: c.category
  })));

  // Convert to BuilderEntity
  const entities: BuilderEntity[] = rawEntities.map(e => {
    // Check if it started exactly in this target year
    const isStartedInTargetYear = e.startDate ? e.startDate.getUTCFullYear() === year : false;
    
    return {
      ...e,
      incomingRelationsCount: e._count.incomingRelations,
      isStartedInTargetYear
    };
  });

  // 3. Process through Builders sequentially
  const theme = buildTheme(year, yearProfile);
  const hero = selectHero(entities, yearProfile?.primaryEventEntityId);
  const highlights = buildHighlights(entities);
  const timeline = buildTimeline(entities);
  const categories = buildCategories(entities, allEntityCategories);
  const navigation = buildNavigation(hero, timeline, categories);

  // 4. Construct Final Object
  return {
    year,
    theme,
    navigation,
    hero,
    timeline,
    highlights,
    categories
  };
}
