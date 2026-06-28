import { NavigationAnchor, BuilderEntity, YearCategory } from "./types";

export function buildNavigation(hero: BuilderEntity | null, timeline: BuilderEntity[], categories: YearCategory[]): NavigationAnchor[] {
  const anchors: NavigationAnchor[] = [];

  if (hero) {
    anchors.push({ id: "hero", label: "Hero" });
  }

  // We always assume a highlights section
  anchors.push({ id: "highlights", label: "Highlights" });

  if (timeline.length > 0) {
    anchors.push({ id: "timeline", label: "Timeline" });
  }

  if (categories.length > 0) {
    anchors.push({ id: "categories", label: "Categories" });
  }

  return anchors;
}
