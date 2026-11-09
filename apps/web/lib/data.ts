import { cache } from "react";
import { client, hasSanity } from "./sanity/client";
import * as Q from "./queries";
import * as M from "./mock";
import type { ClientRef, Product, ProductCard } from "./types";
import {
  CategorieQueryResult,
  FeaturedProductsQueryResult,
  FeaturedRealisationsQueryResult,
  MenuQueryResult,
  MetierQueryResult,
  MetiersQueryResult,
  RealisationQueryResult,
  RealisationsQueryResult,
  SiteSettingsQueryResult,
} from "./sanity/types";

const REVALIDATE = 60; // secondes : un changement dans Sanity apparaît sur le site en ~1 min

function q<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  return client.fetch<T>(query, params, { next: { revalidate: REVALIDATE } });
}

// ---------- Global ----------
export const getSettings = cache(async (): Promise<SiteSettingsQueryResult> => {
  return await q<SiteSettingsQueryResult | null>(Q.siteSettingsQuery);
});

export const getMenu = cache(async (): Promise<MenuQueryResult> => {
  if (!hasSanity) return M.mockMenu as MenuQueryResult;
  return (await q<MenuQueryResult>(Q.menuQuery)) ?? [];
});

// ---------- Pôles ----------
export const getMetiers = cache(async (): Promise<MetiersQueryResult> => {
  if (!hasSanity) return M.mockMetiers as MetiersQueryResult;
  return (await q<MetiersQueryResult>(Q.metiersQuery)) ?? [];
});

export const getMetier = cache(
  async (slug: string): Promise<MetierQueryResult | null> => {
    if (!hasSanity)
      return (M.mockMetiers.find((m) => m.slug === slug) ??
        null) as MetierQueryResult;
    return q<MetierQueryResult | null>(Q.metierQuery, { metier: slug });
  },
);

// ---------- Catalogue ----------
export const getCategorie = cache(
  async (metier: string, categorie: string): Promise<CategorieQueryResult> => {
    return q<CategorieQueryResult>(Q.categorieQuery, { metier, categorie });
  },
);

export const getCategorieProducts = cache(
  async (metier: string, categorie: string): Promise<ProductCard[]> => {
    return (
      (await q<ProductCard[]>(Q.categorieProductsQuery, {
        metier,
        categorie,
      })) ?? []
    );
  },
);

export const getProduct = cache(
  async (
    metier: string,
    categorie: string,
    produit: string,
  ): Promise<Product | null> => {
    return q<Product | null>(Q.productQuery, { metier, categorie, produit });
  },
);

export const getFeaturedProducts = cache(
  async (): Promise<FeaturedProductsQueryResult> => {
    return (
      (await q<FeaturedProductsQueryResult>(Q.featuredProductsQuery)) ?? []
    );
  },
);

// ---------- Réalisations ----------
export const getRealisations = cache(
  async (): Promise<RealisationsQueryResult> => {
    return (await q<RealisationsQueryResult>(Q.realisationsQuery)) ?? [];
  },
);

export const getFeaturedRealisations = cache(
  async (): Promise<FeaturedRealisationsQueryResult> => {
    return (
      (await q<FeaturedRealisationsQueryResult>(Q.featuredRealisationsQuery)) ??
      []
    );
  },
);

export const getRealisation = cache(
  async (slug: string): Promise<RealisationQueryResult | null> => {
    return q<RealisationQueryResult | null>(Q.realisationQuery, { slug });
  },
);

// ---------- À propos ----------
export const getClients = cache(async (): Promise<ClientRef[]> => {
  if (!hasSanity) return M.mockClients;
  return (await q<ClientRef[]>(Q.referencesClientsQuery)) ?? [];
});

// ---------- Sitemap ----------
export async function getSitemapPaths(): Promise<
  { path: string; updated?: string; priority: number }[]
> {
  if (!hasSanity) return [];

  const [metiers, cats, prods, reals] = await Promise.all([
    q<
      { metier: string; aCatalogue?: boolean; _updatedAt: string }[]
    >(Q.metierSlugsQuery),
    q<{ metier: string; categorie: string; _updatedAt: string }[]>(
      Q.categorieSlugsQuery,
    ),
    q<
      {
        metier: string;
        categorie: string;
        produit: string;
        _updatedAt: string;
      }[]
    >(Q.productSlugsQuery),
    q<{ slug: string; _updatedAt: string }[]>(Q.realisationSlugsQuery),
  ]);

  return [
    ...metiers.flatMap((metier) => [
      {
        path: `/services/${metier.metier}`,
        updated: metier._updatedAt,
        priority: 0.7,
      },
      ...(metier.aCatalogue
        ? [
            {
              path: `/produits/${metier.metier}`,
              updated: metier._updatedAt,
              priority: 0.7,
            },
          ]
        : []),
    ]),
    ...cats.map((categorie) => ({
      path: `/produits/${categorie.metier}/${categorie.categorie}`,
      updated: categorie._updatedAt,
      priority: 0.6,
    })),
    ...prods.map((product) => ({
      path: `/produits/${product.metier}/${product.categorie}/${product.produit}`,
      updated: product._updatedAt,
      priority: 0.5,
    })),
    ...reals.map((realisation) => ({
      path: `/realisations/${realisation.slug}`,
      updated: realisation._updatedAt,
      priority: 0.6,
    })),
  ];
}
