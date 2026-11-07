import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound} from 'next/navigation'
import {getMetier, getSettings} from '@/lib/data'
import {seoMeta} from '@/lib/seo'
import {ButtonLink, Container, PageHeader} from '@/components/ui'
import {BorderButton} from '@/components/border-button'
import {SanityImage} from '@/components/sanity-image'
import {CtaBand} from '@/components/cta-band'

type Props = {params: Promise<{metier: string}>}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const m = await getMetier((await params).metier)
  return m ? seoMeta(m.seo, `${m.title} à Bamako`, m.accroche) : {}
}

export default async function ServicePage({params}: Props) {
  const slug = (await params).metier
  const [m, settings] = await Promise.all([getMetier(slug), getSettings()])
  if (!m) notFound()

  return (
    <>
      <PageHeader
        title={m.title}
        intro={m.accroche}
        breadcrumb={[{label: 'Accueil', href: '/'}, {label: 'Services', href: '/services'}, {label: m.title}]}
      >
        <BorderButton href={`/devis?sujet=${encodeURIComponent(m.title)}`}>Demander un devis</BorderButton>
        {m.aCatalogue && <ButtonLink href={`/produits/${m.slug}`} variant="outline">Voir le catalogue</ButtonLink>}
      </PageHeader>

      <Container className="grid gap-12 py-14 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          {m.description && <p className="max-w-2xl text-lg leading-relaxed text-steel">{m.description}</p>}
          {m.prestations && m.prestations.length > 0 && (
            <>
              <h2 className="mt-10 text-2xl font-bold">Ce que nous faisons</h2>
              <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
                {m.prestations.map((p) => (
                  <li key={p.titre} className="py-4">
                    <h3 className="font-bold">{p.titre}</h3>
                    {p.description && <p className="mt-1 text-steel">{p.description}</p>}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <aside className="space-y-6">
          <SanityImage image={m.image} ratio="aspect-[4/3]" className="rounded-lg" fallbackAlt={m.title} />
          {m.aCatalogue && m.categories.length > 0 && (
            <div>
              <h2 className="text-lg font-bold">Catalogue</h2>
              <ul className="mt-2 space-y-1">
                {m.categories.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/produits/${m.slug}/${c.slug}`} className="text-steel underline-offset-4 hover:text-ink hover:underline">{c.title}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </Container>

      <CtaBand settings={settings} subject={m.title} />
    </>
  )
}
