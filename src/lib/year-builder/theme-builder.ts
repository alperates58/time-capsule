import { BuilderEntity, YearTheme } from "./types";
import { YearProfile } from "@prisma/client";

export function buildTheme(year: number, profile?: YearProfile | null): YearTheme {
  const defaultTokens = {
    accentColor: "#3b82f6", // Default blue
    gradientStart: "#0f172a",
    gradientEnd: "#000000",
    mood: "neutral"
  };

  if (!profile) {
    return {
      themeName: `The Year ${year}`,
      designTokens: defaultTokens,
    };
  }

  return {
    themeName: profile.themeName || `The Year ${year}`,
    heroTitle: profile.heroTitle || undefined,
    heroSubtitle: profile.heroSubtitle || undefined,
    editorialSummary: profile.editorialSummary || undefined,
    designTokens: profile.designTokens ? (profile.designTokens as Record<string, any>) : defaultTokens,
  };
}
