import { BuilderEntity } from "./types";
import { DatePrecision } from "@prisma/client";

export function buildTimeline(entities: BuilderEntity[]): BuilderEntity[] {
  // Only include entities that have a valid startDate
  const validEntities = entities.filter(e => e.startDate);

  // Separate exact dates from approximate dates (Year only)
  const exactDates: BuilderEntity[] = [];
  const approximateDates: BuilderEntity[] = [];

  for (const entity of validEntities) {
    if (entity.precision === DatePrecision.YEAR) {
      approximateDates.push(entity);
    } else {
      exactDates.push(entity);
    }
  }

  // Sort exact dates chronologically
  exactDates.sort((a, b) => new Date(a.startDate!).getTime() - new Date(b.startDate!).getTime());

  // We append approximate dates to the end of the timeline
  // Optionally, they could be inserted at the beginning. The rule states "end of timeline".
  return [...exactDates, ...approximateDates];
}
