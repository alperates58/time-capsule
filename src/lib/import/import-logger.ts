import prisma from "../prisma";
import { ImportStatus, RawRecordStatus } from "@prisma/client";
import { getSourceConfig } from "./source-registry";

export async function createImportBatch(sourceName: string) {
  const config = getSourceConfig(sourceName);
  
  // Ensure source exists
  const source = await prisma.source.upsert({
    where: { name: sourceName },
    update: {},
    create: {
      name: sourceName,
      type: config.type,
      trustLevel: config.trustLevel,
    }
  });

  return await prisma.importBatch.create({
    data: {
      sourceId: source.id,
      status: ImportStatus.RUNNING,
    }
  });
}

export async function finalizeImportBatch(batchId: string, stats: any, errors: any[]) {
  const status = errors.length > 0 ? ImportStatus.PARTIAL : ImportStatus.COMPLETED;
  
  await prisma.importBatch.update({
    where: { id: batchId },
    data: {
      status,
      finishedAt: new Date(),
      stats,
      errorLog: errors.length > 0 ? errors : undefined,
    }
  });
}

export async function logRawRecord(batchId: string, sourceId: string, payload: any, status: RawRecordStatus = RawRecordStatus.PROCESSED) {
  return await prisma.rawImportRecord.create({
    data: {
      importBatchId: batchId,
      sourceId,
      rawPayload: payload,
      status,
      normalizedAt: status === RawRecordStatus.PROCESSED ? new Date() : null,
    }
  });
}
