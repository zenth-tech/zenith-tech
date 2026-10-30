import Link from 'next/link'
import type {ProductCard as P, RealisationCard as R} from '@/lib/types'
import {AddToQuoteButton} from './add-to-quote'
import {SanityImage} from './sanity-image'

export const productHref = (p: P) => `/produits/${p.categorie.metier.slug}/${p.categorie.slug}/${p.slug}`

export function ProductCard({product: p}: {product: P}) {
  const specs = (p.caracteristiques ?? []).filter((c) => c.cle && c.valeur).slice(0, 3)
  return (
    <article className="relative flex flex-col overflow-hidden rounded-lg border border-ink/10 bg-white">
      <SanityImage image={p.image} fallbackAlt={p.name} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
      <div className="flex flex-1 flex-col p-4">
        {p.marque && <p className="text-sm text-steel">{p.marque}</p>}
        <h3 className="text-lg font-bold leading-snug">
          <Link href={productHref(p)} className="after:absolute after:inset-0">{p.name}</Link>
        </h3>
        {p.accroche && <p className="mt-1.5 text-sm leading-relaxed text-steel">{p.accroche}</p>}
        {specs.length > 0 && (
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
            {specs.map((c) => (
              <div key={c.cle} className="contents">
                <dt className="text-steel">{c.cle}</dt>
                <dd className="font-semibold">{c.valeur}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="relative z-10 mt-auto pt-4">
          <AddToQuoteButton sku={p.sku} name={p.name} url={productHref(p)} size="sm" className="w-full" />
        </div>
      </div>
    </article>
  )
}

export function RealisationCard({item: r}: {item: R}) {
  return (
    <article className="group relative">
      <SanityImage image={r.image} fallbackAlt={r.title} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="rounded-lg" />
      <h3 className="mt-3 text-lg font-bold leading-snug">
        <Link href={`/realisations/${r.slug}`} className="after:absolute after:inset-0 group-hover:underline underline-offset-4">{r.title}</Link>
      </h3>
      {r.resume && <p className="mt-1 text-sm leading-relaxed text-steel">{r.resume}</p>}
      {r.ville && <p className="mt-1 text-sm font-semibold">{r.ville}</p>}
    </article>
  )
}
