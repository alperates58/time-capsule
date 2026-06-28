import prisma from "../prisma";

/**
 * Finds an existing entity by slug or exact title.
 */
export async function matchEntity(slug: string, title: string) {
  // First attempt: match by slug
  let existing = await prisma.entity.findUnique({
    where: { slug }
  });

  if (existing) return existing;

  // Second attempt: match by exact title (case-insensitive in DB collation usually, but let's be safe)
  existing = await prisma.entity.findFirst({
    where: {
      title: {
        equals: title,
        mode: 'insensitive'
      }
    }
  });

  return existing;
}
