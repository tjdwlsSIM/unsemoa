import type { MetadataRoute } from "next";
import { TTI, ZODIAC } from "@/lib/fortune";
import { GUIDE } from "@/lib/guide";
import { nav, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const daily = (path: string, priority: number) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: "daily" as const,
    priority,
  });

  return [
    daily("", 1),
    ...nav.map((item) => daily(item.href, 0.9)),
    ...TTI.map((t) => daily(`/tti/${t.id}`, 0.8)),
    ...ZODIAC.map((z) => daily(`/horoscope/${z.id}`, 0.8)),
    ...GUIDE.map((g) => ({
      url: `${site.url}/guide/${g.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${site.url}/privacy`, lastModified: now, changeFrequency: "yearly" as const, priority: 0.1 },
  ];
}
