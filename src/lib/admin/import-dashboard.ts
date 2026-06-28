import prisma from "../prisma";
import { ImportStatus } from "@prisma/client";

export async function getImportDashboardStats() {
  const [
    totalEntities,
    totalRelations,
    totalSources,
    pendingReviews,
    failedImports,
    lastSuccessfulImport
  ] = await Promise.all([
    prisma.entity.count(),
    prisma.entityRelation.count(),
    prisma.source.count(),
    prisma.reviewQueueItem.count({ where: { status: "PENDING" } }),
    prisma.importBatch.count({ where: { status: "FAILED" } }),
    prisma.importBatch.findFirst({
      where: { status: { in: ["COMPLETED", "PARTIAL"] } },
      orderBy: { finishedAt: "desc" }
    })
  ]);

  return {
    totalEntities,
    totalRelations,
    totalSources,
    pendingReviews,
    failedImports,
    lastSuccessfulImportDate: lastSuccessfulImport?.finishedAt || null
  };
}

export async function getRecentImportBatches(take: number = 10) {
  return await prisma.importBatch.findMany({
    take,
    orderBy: { startedAt: "desc" },
    include: {
      source: {
        select: { name: true }
      }
    }
  });
}

export async function getRecentRawRecords(take: number = 20) {
  return await prisma.rawImportRecord.findMany({
    take,
    orderBy: { importBatch: { startedAt: "desc" } },
    include: {
      source: {
        select: { name: true }
      }
    }
  });
}

export async function getPendingReviewQueueItems(take: number = 20) {
  return await prisma.reviewQueueItem.findMany({
    take,
    where: { status: "PENDING" },
    orderBy: { createdAt: "desc" }
  });
}
