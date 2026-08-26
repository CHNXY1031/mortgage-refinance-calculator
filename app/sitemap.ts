import type { MetadataRoute } from "next";

import { REFINANCE_SCENARIOS } from "@/lib/refinanceScenarios";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const scenarioPages = REFINANCE_SCENARIOS.map((scenario) => ({
    url: `${SITE_URL}/refinance/${scenario.amountSlug}/${scenario.ratesSlug}`,
    lastModified: new Date("2026-08-26"),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date("2026-08-26"),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...scenarioPages,
  ];
}
