'use client'

import {usePathname, useRouter} from 'next/navigation'
import {useId} from 'react'
import type {Facet} from '@/lib/facets'

/** Les filtres vivent dans l'URL (?f.Résolution=4+MP) : les liens sont partageables. */
export function Filters({facets, selected}: {facets: Facet[]; selected: Record<string, string[]>}) {
  const router = useRouter()
  const pathname = usePathname()
  const idPrefix = useId()

  function toggle(cle: string, valeur: string) {
    const next = {...selected}
    const set = new Set(next[cle] ?? [])
    if (set.has(valeur)) set.delete(valeur)
    else set.add(valeur)
    next[cle] = [...set]
    const sp = new URLSearchParams()
    for (const [k, vals] of Object.entries(next)) for (const v of vals) sp.append(`f.${k}`, v)
    const qs = sp.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, {scroll: false})
  }

  if (facets.length === 0) return null
  return (
    <div className="space-y-6">
      {facets.map((f) => (
        <fieldset key={f.cle}>
          <legend className="mb-2 font-display font-bold">{f.cle}</legend>
          <ul className="space-y-1">
            {f.valeurs.map((v) => {
              const checked = selected[f.cle]?.includes(v.valeur) ?? false
              const id = `${idPrefix}-${f.cle}-${v.valeur}`
              return (
                <li key={v.valeur}>
                  <label htmlFor={id} className="flex min-h-9 cursor-pointer items-center gap-2.5">
                    <input
                      id={id}
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(f.cle, v.valeur)}
                      className="h-4 w-4 accent-[#10243b]"
                    />
                    <span>{v.valeur}</span>
                    <span className="text-sm text-steel">({v.count})</span>
                  </label>
                </li>
              )
            })}
          </ul>
        </fieldset>
      ))}
    </div>
  )
}
