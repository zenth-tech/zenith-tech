import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://zenith-tech-swart.vercel.app";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/studio/"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
