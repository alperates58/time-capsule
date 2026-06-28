import { EntityType, DatePrecision } from "@prisma/client";
import { NormalizedEntity } from "../../types";

function extractQID(uri: string): string {
  return uri.split("/").pop() || "";
}

function generateSlug(title: string, qid: string): string {
  const safeTitle = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${safeTitle}-${qid.toLowerCase()}`;
}

export function normalizeWikidataResult(binding: any, targetType: EntityType): NormalizedEntity | null {
  if (!binding.itemLabel || !binding.itemLabel.value) return null;
  // User decision: Skip entities without English description for this phase
  if (!binding.itemDescription || !binding.itemDescription.value) return null;
  
  // Also skip if label is a QID (meaning no English label exists)
  if (binding.itemLabel.value.startsWith("Q") && !isNaN(Number(binding.itemLabel.value.substring(1)))) {
    return null;
  }

  const qid = extractQID(binding.item.value);
  const title = binding.itemLabel.value;
  const description = binding.itemDescription.value;
  const slug = generateSlug(title, qid);
  
  let startDate: string | undefined;
  if (binding.date && binding.date.value) {
    startDate = binding.date.value;
  }

  return {
    slug,
    type: targetType,
    title,
    description,
    startDate,
    precision: DatePrecision.EXACT,
    externalId: qid,
    sourceUrl: binding.item.value,
  };
}
