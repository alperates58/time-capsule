import prisma from "../prisma";
import { ReviewType, ReviewStatus } from "@prisma/client";

export async function createReviewQueueItem(
  type: ReviewType,
  reason: string,
  payload: any,
  priority = 0,
  confidence?: number
) {
  return await prisma.reviewQueueItem.create({
    data: {
      type,
      reason,
      payload,
      priority,
      confidence,
      status: ReviewStatus.PENDING,
    }
  });
}
