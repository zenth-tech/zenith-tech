import {defineQuery} from 'next-sanity'

// ---------- Fragments ----------
const IMAGE = `{ alt, hotspot, crop, asset->{ _id, url, metadata { lqip, dimensions { width, height } } } }`

const PRODUCT_CARD = `{
  _id, name, "slug": slug.current, sku, accroche, marque,
  "image": images[0]${IMAGE},
  caracteristiques,
  "categorie": categorie->{ title, "slug": slug.current, "metier": metier->{ "slug": slug.current } }
}`

const REALISATION_CARD = `{
  _id, title, "slug": slug.current, resume, ville, typeClient, date,
  "image": images[0]${IMAGE},
  "metiers": metiers[]->{ title, "slug": slug.current }
}`

// ---------- Global ----------
export const siteSettingsQuery = defineQuery(`
  *[_type == "siteSettings" && _id == "siteSettings"][0]{
    nomEntreprise, slogan, presentation, logo${IMAGE},
    aProposTitre, aProposTexte, aProposImage${IMAGE}, valeurs, chiffresCles,
    telephone, whatsapp, email, adresse, ville, horaires, zoneCouverture, rccm, nina,
    facebook, instagram, linkedin, youtube, tiktok, seo
  }
`)

// Méga-menu : métiers → catégories
export const menuQuery = defineQuery(`
  *[_type == "metier"] | order(ordre asc) {
    title, "slug": slug.current, accroche, aCatalogue,
    "categories": *[_type == "categorie" && metier._ref == ^._id] | order(ordre asc) {
      title, "slug": slug.current
    }
  }
`)

// ---------- Catalogue ----------
export const metiersQuery = defineQuery(`
  *[_type == "metier"] | order(ordre asc) {
    _id, title, "slug": slug.current, accroche, description, aCatalogue, image${IMAGE},
    "categories": *[_type == "categorie" && metier._ref == ^._id] | order(ordre asc) {
      title, "slug": slug.current, image${IMAGE}
    }
  }
`)

export const metierQuery = defineQuery(`
  *[_type == "metier" && slug.current == $metier][0]{
    title, "slug": slug.current, accroche, description, aCatalogue, prestations, image${IMAGE}, seo,
    "categories": *[_type == "categorie" && metier._ref == ^._id] | order(ordre asc) {
      title, "slug": slug.current, description, image${IMAGE}
    }
  }
`)

export const categorieQuery = defineQuery(`
  *[_type == "categorie" && slug.current == $categorie && metier->slug.current == $metier][0]{
    title, "slug": slug.current, description, image${IMAGE}, filtres, seo,
    "metier": metier->{ title, "slug": slug.current }
  }
`)

export const categorieProductsQuery = defineQuery(`
  *[_type == "product"
    && categorie->slug.current == $categorie
    && categorie->metier->slug.current == $metier
  ] | order(name asc) ${PRODUCT_CARD}
`)

export const productQuery = defineQuery(`
  *[_type == "product"
    && slug.current == $produit
    && categorie->slug.current == $categorie
    && categorie->metier->slug.current == $metier
  ][0]{
    _id, name, "slug": slug.current, sku, marque, accroche, pointsForts, description,
    images[]${IMAGE}, videoUrl, caracteristiques,
    "ficheTechniqueUrl": ficheTechnique.asset->url,
    lienFabricant, seo,
    "categorie": categorie->{ title, "slug": slug.current, "metier": metier->{ title, "slug": slug.current } },
    "similaires": *[_type == "product" && categorie._ref == ^.categorie._ref && _id != ^._id][0...4] ${PRODUCT_CARD},
    "realisations": *[_type == "realisation" && references(^._id)][0...3] ${REALISATION_CARD}
  }
`)

// Produits mis en avant (accueil)
export const featuredProductsQuery = defineQuery(`
  *[_type == "product" && mettreEnAvant == true] | order(name asc)[0...8] ${PRODUCT_CARD}
`)

// ---------- Réalisations ----------
export const realisationsQuery = defineQuery(`
  *[_type == "realisation"] | order(date desc) ${REALISATION_CARD}
`)

export const featuredRealisationsQuery = defineQuery(`
  *[_type == "realisation" && mettreEnAvant == true] | order(date desc)[0...6] ${REALISATION_CARD}
`)

export const realisationQuery = defineQuery(`
  *[_type == "realisation" && slug.current == $slug][0]{
    _id, title, "slug": slug.current, resume, ville, client, typeClient, date,
    contexte, solution, resultat, images[]${IMAGE}, videoUrl, seo,
    "metiers": metiers[]->{ title, "slug": slug.current },
    "produits": produits[]->${PRODUCT_CARD}
  }
`)

// ---------- À propos ----------
export const referencesClientsQuery = defineQuery(`
  *[_type == "referenceClient" && afficherSurSite == true] | order(ordre asc) {
    _id, nom, secteur, logo${IMAGE}
  }
`)

// Pôles catalogue uniquement (pour /produits)
export const metiersCatalogueQuery = defineQuery(`
  *[_type == "metier" && aCatalogue == true] | order(ordre asc) {
    _id, title, "slug": slug.current, accroche, image${IMAGE},
    "categories": *[_type == "categorie" && metier._ref == ^._id] | order(ordre asc) {
      title, "slug": slug.current, image${IMAGE}
    }
  }
`)

// ---------- generateStaticParams / sitemap ----------
export const productSlugsQuery = defineQuery(`
  *[_type == "product" && defined(slug.current) && defined(categorie->slug.current)]{
    "produit": slug.current,
    "categorie": categorie->slug.current,
    "metier": categorie->metier->slug.current,
    _updatedAt
  }
`)

export const categorieSlugsQuery = defineQuery(`
  *[_type == "categorie" && defined(slug.current)]{
    "categorie": slug.current, "metier": metier->slug.current, _updatedAt
  }
`)

export const metierSlugsQuery = defineQuery(`
  *[_type == "metier" && defined(slug.current)]{ "metier": slug.current, _updatedAt }
`)

export const realisationSlugsQuery = defineQuery(`
  *[_type == "realisation" && defined(slug.current)]{ "slug": slug.current, _updatedAt }
`)
