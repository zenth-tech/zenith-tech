# Schéma Sanity : site vitrine (vidéosurveillance, photovoltaïque, sécurité de bâtiment)

## Contenu
- `schemaTypes/` : documents (`siteSettings`, `metier`, `categorie`, `product`, `realisation`, `referenceClient`) et objets (`seo`, `imageWithAlt`, `caracteristique`)
- `structure.ts` : menu du Studio (paramètres du site en document unique)
- `lib/queries.ts` : requêtes GROQ pour Next.js (menu, catalogue, fiche produit, réalisations, slugs)
- `lib/facets.ts` : génération et application des filtres par caractéristique

## Intégration dans le Studio
Copiez `schemaTypes/` et `structure.ts` à la racine du Studio, puis dans `sanity.config.ts` :

```ts
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  // ...projectId, dataset
  plugins: [structureTool({structure})],
  schema: {
    types: schemaTypes,
    // empêche de créer plusieurs "Paramètres du site"
    templates: (templates) => templates.filter(({schemaType}) => schemaType !== 'siteSettings'),
  },
  document: {
    actions: (input, {schemaType}) =>
      schemaType === 'siteSettings'
        ? input.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : input,
  },
})
```

## Modèle
```
metier (pôle d'activité) ← categorie ← product
   │ aCatalogue = true  → catalogue sous /produits
   │ aCatalogue = false → page de service uniquement (prestations)
realisation ──→ product (produits installés)
referenceClient (page À propos)
siteSettings (unique : contact, RCCM/NINA, À propos, valeurs, chiffres clés)
```
Le champ s'appelle `metier` dans le code mais représente un **pôle** : créez les six pôles de ZENITH TECH.
Pour le SEO, vous pouvez scinder un pôle en plusieurs (ex : « Vidéosurveillance » séparé de « Contrôle d'accès et anti-intrusion »).
Le pôle d'un produit se déduit via `categorie->metier->` (pas de champ en double).

## Règles de saisie à respecter
- Les clés de `caracteristiques` doivent être écrites exactement comme dans `categorie.filtres` (le Studio avertit en cas de faute de casse/accents).
- Mêmes formats de valeur pour tous les produits (toujours « 4 MP », jamais « 4MP » ou « 4 mégapixels »).
- Ne changez jamais le `sku` après création (lien futur avec l’ERP).
- Vidéos : liens YouTube/Bunny/Vimeo, pas de fichiers dans Sanity.

## URLs prévues (Next.js App Router)
```
/services                                  → metiersQuery (tous les pôles)
/services/[metier]                         → metierQuery (présentation + prestations + lien catalogue si aCatalogue)
/produits                                  → metiersCatalogueQuery
/produits/[metier]/[categorie]             → categorieQuery + categorieProductsQuery + buildFacets/applyFilters
/produits/[metier]/[categorie]/[produit]   → productQuery
/realisations, /realisations/[slug]        → realisationsQuery, realisationQuery
/a-propos                                  → siteSettingsQuery + referencesClientsQuery
/mentions-legales                          → siteSettingsQuery (rccm, nina)
```
Filtres : stockez la sélection dans les `searchParams` (`?Resolution=4+MP&…`) pour des URLs partageables.

## À ne pas publier
Le compte bancaire n'a pas sa place dans Sanity ni sur le site public.
Les clients références ne sont affichés que si `afficherSurSite` est coché (accord du client).
