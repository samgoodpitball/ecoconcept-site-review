import type { MetadataRoute } from "next";
import { catalog } from "@/content/catalog";
import { categories, pageCount, pageHref } from "@/lib/catalog-view";

const base = process.env.SITE_URL ?? "https://www.ecoconcept.kg";

// Главная, продуктовые страницы, разборы, расчёт, каталог и страница на каждую
// модель. Страницы, которых ещё нет (/projects, /careers), сюда не попадают.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...[
      { path: "/heat-pumps", priority: 0.9 },
      { path: "/solar", priority: 0.9 },
      { path: "/to-know", priority: 0.8 },
      { path: "/to-know/what-is-a-heat-pump", priority: 0.8 },
      { path: "/to-know/grid-or-hybrid", priority: 0.8 },
      { path: "/calculator", priority: 0.8 },
      { path: "/about", priority: 0.7 },
    ].map((p) => ({
      url: `${base}${p.path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: p.priority,
    })),
    ...categories.flatMap((c) =>
      Array.from({ length: pageCount(c.id) }, (_, i) => ({
        url: `${base}${pageHref(c.id, i + 1)}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: i === 0 ? 0.9 : 0.6,
      }))
    ),
    ...catalog.map((item) => ({
      url: `${base}/catalog/${item.category}/${item.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
