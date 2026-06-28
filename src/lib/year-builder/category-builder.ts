import { BuilderEntity, YearCategory } from "./types";

export function buildCategories(entities: BuilderEntity[], entityCategories: { entityId: string, category: { slug: string, name: string, description: string | null } }[]): YearCategory[] {
  const categoryMap = new Map<string, YearCategory>();

  // Initialize categories based on relationships
  for (const ec of entityCategories) {
    if (!categoryMap.has(ec.category.slug)) {
      categoryMap.set(ec.category.slug, {
        slug: ec.category.slug,
        name: ec.category.name,
        description: ec.category.description || undefined,
        entities: []
      });
    }
  }

  // Map entities into categories
  for (const entity of entities) {
    const categoriesForEntity = entityCategories.filter(ec => ec.entityId === entity.id);
    for (const ec of categoriesForEntity) {
      const cat = categoryMap.get(ec.category.slug);
      if (cat) {
        cat.entities.push(entity);
      }
    }
  }

  // Remove empty categories and sort by name
  return Array.from(categoryMap.values())
    .filter(cat => cat.entities.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name));
}
