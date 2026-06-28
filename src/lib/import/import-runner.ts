import prisma from "../prisma";
import { ImportPayload, ImportJobResult } from "./types";
import { createImportBatch, finalizeImportBatch, logRawRecord } from "./import-logger";
import { matchEntity } from "./entity-matcher";
import { createReviewQueueItem } from "./review-queue";
import { ReviewType, RawRecordStatus } from "@prisma/client";

export async function runManualImport(sourceName: string, payload: ImportPayload): Promise<ImportJobResult> {
  const batch = await createImportBatch(sourceName);
  const errors: string[] = [];
  let importedEntities = 0;
  let importedRelations = 0;
  let importedCategories = 0;

  try {
    // 1. Process Categories
    if (payload.categories) {
      for (const cat of payload.categories) {
        try {
          await prisma.category.upsert({
            where: { slug: cat.slug },
            update: { name: cat.name, description: cat.description },
            create: { slug: cat.slug, name: cat.name, description: cat.description }
          });
          importedCategories++;
        } catch (error: any) {
          errors.push(`Category ${cat.slug} failed: ${error.message}`);
        }
      }
    }

    // 2. Process Entities
    if (payload.entities) {
      for (const ent of payload.entities) {
        try {
          const existing = await matchEntity(ent.slug, ent.title);

          if (existing) {
            // Idempotency / Conflict logic
            // For this manual importer, we only update if it's safe (e.g. adding missing description)
            // If there's a risk of destructive overwrite, we log to Review Queue instead.
            if (existing.description && ent.description && existing.description !== ent.description) {
              await createReviewQueueItem(ReviewType.MERGE_CONFLICT, "Conflicting descriptions", { incoming: ent, existing });
              await logRawRecord(batch.id, batch.sourceId, ent, RawRecordStatus.SKIPPED);
              continue; // Skip destructive update
            }

            await prisma.entity.update({
              where: { id: existing.id },
              data: {
                description: existing.description || ent.description, // Only fill if empty
                subtitle: existing.subtitle || ent.subtitle,
                startDate: ent.startDate ? new Date(ent.startDate) : existing.startDate,
                endDate: ent.endDate ? new Date(ent.endDate) : existing.endDate,
              }
            });
            
            if (ent.externalId) {
              const existingRef = await prisma.sourceReference.findFirst({
                where: { entityId: existing.id, externalId: ent.externalId, sourceId: batch.sourceId }
              });
              if (!existingRef) {
                await prisma.sourceReference.create({
                  data: {
                    sourceId: batch.sourceId,
                    entityId: existing.id,
                    externalId: ent.externalId,
                    url: ent.sourceUrl,
                    rawPayload: ent as any,
                    confidence: 100
                  }
                });
              }
            }
          } else {
            // Create new
            const newEnt = await prisma.entity.create({
              data: {
                slug: ent.slug,
                type: ent.type,
                title: ent.title,
                subtitle: ent.subtitle,
                description: ent.description,
                startDate: ent.startDate ? new Date(ent.startDate) : null,
                endDate: ent.endDate ? new Date(ent.endDate) : null,
                precision: ent.precision,
              }
            });
            
            if (ent.externalId) {
              await prisma.sourceReference.create({
                data: {
                  sourceId: batch.sourceId,
                  entityId: newEnt.id,
                  externalId: ent.externalId,
                  url: ent.sourceUrl,
                  rawPayload: ent as any,
                  confidence: 100
                }
              });
            }
            importedEntities++;
          }
          await logRawRecord(batch.id, batch.sourceId, ent, RawRecordStatus.PROCESSED);
        } catch (error: any) {
          errors.push(`Entity ${ent.slug} failed: ${error.message}`);
          await logRawRecord(batch.id, batch.sourceId, ent, RawRecordStatus.FAILED);
        }
      }
    }

    // 3. Process Entity Categories
    if (payload.entityCategories) {
      for (const ec of payload.entityCategories) {
        try {
          const entity = await prisma.entity.findUnique({ where: { slug: ec.entitySlug } });
          const category = await prisma.category.findUnique({ where: { slug: ec.categorySlug } });
          
          if (entity && category) {
            await prisma.entityCategory.upsert({
              where: {
                entityId_categoryId: {
                  entityId: entity.id,
                  categoryId: category.id
                }
              },
              update: {},
              create: {
                entityId: entity.id,
                categoryId: category.id
              }
            });
          }
        } catch (error: any) {
          errors.push(`EntityCategory ${ec.entitySlug}-${ec.categorySlug} failed: ${error.message}`);
        }
      }
    }

    // 4. Process Relations
    if (payload.relations) {
      for (const rel of payload.relations) {
        try {
          const fromEntity = await prisma.entity.findUnique({ where: { slug: rel.fromSlug } });
          const toEntity = await prisma.entity.findUnique({ where: { slug: rel.toSlug } });

          if (fromEntity && toEntity) {
            // Check if relation exists to ensure idempotency
            const existingRel = await prisma.entityRelation.findFirst({
              where: {
                fromEntityId: fromEntity.id,
                toEntityId: toEntity.id,
                relationType: rel.relationType
              }
            });

            if (!existingRel) {
              await prisma.entityRelation.create({
                data: {
                  fromEntityId: fromEntity.id,
                  toEntityId: toEntity.id,
                  relationType: rel.relationType,
                  startDate: rel.startDate ? new Date(rel.startDate) : null,
                  endDate: rel.endDate ? new Date(rel.endDate) : null,
                }
              });
              importedRelations++;
            }
          }
        } catch (error: any) {
          errors.push(`Relation ${rel.fromSlug}->${rel.toSlug} failed: ${error.message}`);
        }
      }
    }

  } catch (globalError: any) {
    errors.push(`Global Failure: ${globalError.message}`);
  }

  // 5. Finalize
  await finalizeImportBatch(batch.id, { importedEntities, importedRelations, importedCategories }, errors);

  return {
    success: errors.length === 0,
    importedEntities,
    importedRelations,
    importedCategories,
    errors
  };
}
