import { defineQuery } from "groq";

/** Pôles parents uniquement (ceux qui n'ont pas de parent). */
export const polesQuery = defineQuery(`
  *[_type == "metier" && !defined(parent)] | order(ordre asc) {
    _id, title, "slug": slug.current, accroche, aCatalogue
  }
`);

/**
 * Catalogue : pôles → sous-pôles → catégories.
 * Ne garde que les pôles qui ont un catalogue directement, ou au moins un sous-pôle avec catalogue.
 * `nbProduits` permet de masquer les catégories vides (voir pruneCatalogue).
 */
export const catalogueQuery = defineQuery(`
  *[_type == "metier" && !defined(parent) && (
    aCatalogue == true ||
    count(*[_type == "metier" && parent._ref == ^._id && aCatalogue == true]) > 0
  )] | order(ordre asc) {
    title, "slug": slug.current, accroche,
    "categories": *[_type == "categorie" && metier._ref == ^._id] | order(ordre asc) {
      title, "slug": slug.current,
      "nbProduits": count(*[_type == "product" && categorie._ref == ^._id])
    },
    "sousPoles": *[_type == "metier" && parent._ref == ^._id && aCatalogue == true] | order(ordre asc) {
      title, "slug": slug.current, accroche,
      "categories": *[_type == "categorie" && metier._ref == ^._id] | order(ordre asc) {
        title, "slug": slug.current,
        "nbProduits": count(*[_type == "product" && categorie._ref == ^._id])
      }
    }
  }
`);

export type CatalogueCategory = {
  title: string;
  slug: string;
  nbProduits: number;
};
export type CatalogueSousPole = {
  title: string;
  slug: string;
  accroche?: string;
  categories: CatalogueCategory[];
};
export type CataloguePole = {
  title: string;
  slug: string;
  accroche?: string;
  categories: CatalogueCategory[]; // catégories directes (pôle sans sous-pôles)
  sousPoles: CatalogueSousPole[];
};

/**
 * Retire ce qui est vide.
 * - onlyWithProducts = false : garde toutes les catégories (utile pendant la saisie du contenu).
 * - onlyWithProducts = true  : masque les catégories sans produit, puis les sous-pôles et pôles devenus vides.
 */
export function pruneCatalogue(
  poles: CataloguePole[],
  onlyWithProducts = false,
): CataloguePole[] {
  const keep = (c: CatalogueCategory) => !onlyWithProducts || c.nbProduits > 0;
  return poles
    .map((p) => ({
      ...p,
      categories: p.categories.filter(keep),
      sousPoles: p.sousPoles
        .map((s) => ({ ...s, categories: s.categories.filter(keep) }))
        .filter((s) => s.categories.length > 0),
    }))
    .filter((p) => p.categories.length > 0 || p.sousPoles.length > 0);
}
