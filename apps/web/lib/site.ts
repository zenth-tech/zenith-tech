import { SiteSettingsQueryResult } from "@/lib/sanity/types";
import type { ProductCard as P } from "@/lib/types";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

export const digits = (s?: string) => (s ?? "").replace(/\D/g, "");

export const telHref = (s?: SiteSettingsQueryResult) =>
  s?.telephone?.length ? `tel:+${digits(s.telephone?.[0])}` : undefined;

export const oneTelHref = (t?: string) => `tel:+${digits(t)}`;
export const productHref = (p: P) =>
  `/produits/${p.categorie?.metier?.slug}/${p.categorie?.slug}/${p.slug}`;

export const whatsappHref = (s?: SiteSettingsQueryResult, message?: string) =>
  s?.whatsapp
    ? `https://wa.me/${digits(s.whatsapp?.[0])}${message ? `?text=${encodeURIComponent(message)}` : ""}`
    : undefined;

export const mailHref = (s?: SiteSettingsQueryResult, subject?: string) =>
  s?.email
    ? `mailto:${s.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ""}`
    : undefined;
