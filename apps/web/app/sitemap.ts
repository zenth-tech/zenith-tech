import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getSitemapPaths } from "@/lib/data";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fixed = [
    "",
    "/services",
    "/produits",
    "/realisations",
    "/a-propos",
    "/contact",
    "/devis",
    "/mentions-legales",
  ];
  const dynamic = await getSitemapPaths();

  return [
    ...fixed.map((p) => ({
      url: `${SITE_URL}${p}`,
      changeFrequency:
        p === "/mentions-legales" ? ("yearly" as const) : ("weekly" as const),
      priority: p === "" ? 1 : p === "/mentions-legales" ? 0.3 : 0.7,
    })),
    ...dynamic.map((d) => ({
      url: `${SITE_URL}${d.path}`,
      ...(d.updated ? { lastModified: new Date(d.updated) } : {}),
      priority: d.priority,
    })),
  ];
}
