import { cache } from "react";
import { client, hasSanity } from "./sanity/client";
import * as Q from "./queries";
import * as M from "./mock";
import type {
  Categorie,
  ClientRef,
  MenuMetier,
  Metier,
  Product,
  ProductCard,
  Realisation,
  RealisationCard,
  Settings,
} from "./types";

const REVALIDATE = 60; // secondes : un changement dans Sanity apparaît sur le site en ~1 min

function q<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  return client.fetch<T>(query, params, { next: { revalidate: REVALIDATE } });
}

// ---------- Global ----------
export const getSettings = cache(async (): Promise<Settings> => {
  if (!hasSanity) return M.mockSettings;
  return (await q<Settings | null>(Q.siteSettingsQuery)) ?? {};
});

export const getMenu = async (): Promise<MenuMetier[]> => {
  if (!hasSanity) return M.mockMenu;
  return (await q<MenuMetier[]>(Q.menuQuery)) ?? [];
};

// ---------- Pôles ----------
export const getMetiers = async (): Promise<Metier[]> => {
  if (!hasSanity) return M.mockMetiers;
  return (await q<Metier[]>(Q.metiersQuery)) ?? [];
};

export const getMetier = cache(async (slug: string): Promise<Metier | null> => {
  if (!hasSanity) return M.mockMetiers.find((m) => m.slug === slug) ?? null;
  return q<Metier | null>(Q.metierQuery, { metier: slug });
});

// ---------- Catalogue ----------
export const getCategorie = cache(
  async (metier: string, categorie: string): Promise<Categorie | null> => {
    if (!hasSanity)
      return (
        M.mockCategories.find(
          (c) => c.slug === categorie && c.metier.slug === metier,
        ) ?? null
      );
    return q<Categorie | null>(Q.categorieQuery, { metier, categorie });
  },
);

export const getCategorieProducts = cache(
  async (metier: string, categorie: string): Promise<ProductCard[]> => {
    if (!hasSanity) {
      return M.mockProducts.filter(
        (p) =>
          p.categorie.slug === categorie && p.categorie.metier.slug === metier,
      );
    }
    return (
      (await q<ProductCard[]>(Q.categorieProductsQuery, {
        metier,
        categorie,
      })) ?? []
    );
  },
);

export const getProduct = async (
  metier: string,
  categorie: string,
  produit: string,
): Promise<Product | null> => {
  if (!hasSanity) {
    const p = M.mockProducts.find(
      (x) =>
        x.slug === produit &&
        x.categorie.slug === categorie &&
        x.categorie.metier.slug === metier,
    );
    return p ? M.mockProductDetail(p) : null;
  }
  return q<Product | null>(Q.productQuery, { metier, categorie, produit });
};

export const getFeaturedProducts = cache(async (): Promise<ProductCard[]> => {
  if (!hasSanity) return M.mockProducts;
  return (await q<ProductCard[]>(Q.featuredProductsQuery)) ?? [];
});

// ---------- Réalisations ----------
export const getRealisations = cache(async (): Promise<RealisationCard[]> => {
  if (!hasSanity) return M.mockRealisations;
  return (await q<RealisationCard[]>(Q.realisationsQuery)) ?? [];
});

export const getFeaturedRealisations = cache(
  async (): Promise<RealisationCard[]> => {
    if (!hasSanity) return M.mockRealisations;
    return (await q<RealisationCard[]>(Q.featuredRealisationsQuery)) ?? [];
  },
);

export const getRealisation = cache(
  async (slug: string): Promise<Realisation | null> => {
    if (!hasSanity) {
      const r = M.mockRealisations.find((x) => x.slug === slug);
      return r ? M.mockRealisationDetail(r) : null;
    }
    return q<Realisation | null>(Q.realisationQuery, { slug });
  },
);

// ---------- À propos ----------
export const getClients = cache(async (): Promise<ClientRef[]> => {
  if (!hasSanity) return M.mockClients;
  return (await q<ClientRef[]>(Q.referencesClientsQuery)) ?? [];
});

// ---------- Sitemap ----------
export async function getSitemapPaths(): Promise<
  { path: string; updated?: string }[]
> {
  if (!hasSanity) {
    return [
      ...M.mockMetiers.map((m) => ({ path: `/services/${m.slug}` })),
      ...M.mockCategories.map((c) => ({
        path: `/produits/${c.metier.slug}/${c.slug}`,
      })),
      ...M.mockProducts.map((p) => ({
        path: `/produits/${p.categorie.metier.slug}/${p.categorie.slug}/${p.slug}`,
      })),
      ...M.mockRealisations.map((r) => ({ path: `/realisations/${r.slug}` })),
    ];
  }
  const [metiers, cats, prods, reals] = await Promise.all([
    q<{ metier: string; _updatedAt: string }[]>(Q.metierSlugsQuery),
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
    ...metiers.map((m) => ({
      path: `/services/${m.metier}`,
      updated: m._updatedAt,
    })),
    ...cats.map((c) => ({
      path: `/produits/${c.metier}/${c.categorie}`,
      updated: c._updatedAt,
    })),
    ...prods.map((p) => ({
      path: `/produits/${p.metier}/${p.categorie}/${p.produit}`,
      updated: p._updatedAt,
    })),
    ...reals.map((r) => ({
      path: `/realisations/${r.slug}`,
      updated: r._updatedAt,
    })),
  ];
}
