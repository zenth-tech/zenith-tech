type Carac = {cle?: string | null; valeur?: string | null}
type WithCarac = {caracteristiques?: Carac[] | null}

export type FacetValue = {valeur: string; count: number}
export type Facet = {cle: string; valeurs: FacetValue[]}

/**
 * Construit les filtres d’une catégorie à partir de ses produits.
 * `filtres` vient du champ `filtres` du document catégorie.
 * Un filtre à une seule valeur est masqué (inutile).
 */
export function buildFacets(products: WithCarac[], filtres: string[] = []): Facet[] {
  return filtres
    .map((cle) => {
      const counts = new Map<string, number>()
      for (const p of products) {
        const c = p.caracteristiques?.find((x) => x.cle === cle)
        if (c?.valeur) counts.set(c.valeur, (counts.get(c.valeur) ?? 0) + 1)
      }
      const valeurs = [...counts]
        .map(([valeur, count]) => ({valeur, count}))
        .sort((a, b) => a.valeur.localeCompare(b.valeur, 'fr', {numeric: true}))
      return {cle, valeurs}
    })
    .filter((f) => f.valeurs.length > 1)
}

/**
 * Applique les filtres sélectionnés.
 * Logique : OU à l’intérieur d’un filtre, ET entre les filtres.
 * `selected` ex : { "Résolution": ["4 MP", "8 MP"], "Vision nocturne": ["30 m"] }
 */
export function applyFilters<T extends WithCarac>(
  products: T[],
  selected: Record<string, string[]>,
): T[] {
  const entries = Object.entries(selected).filter(([, v]) => v.length > 0)
  if (entries.length === 0) return products
  return products.filter((p) =>
    entries.every(([cle, valeurs]) => {
      const c = p.caracteristiques?.find((x) => x.cle === cle)
      return !!c?.valeur && valeurs.includes(c.valeur)
    }),
  )
}
