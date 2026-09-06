import type { MetadataRoute } from "next";

const base = process.env.SITE_URL ?? "https://www.ecoconcept.kg";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/", "/thanks", "/privacy"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
