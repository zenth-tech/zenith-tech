import type {Metadata} from 'next'
import Link from 'next/link'
import {getMetiers, getSettings} from '@/lib/data'
import {Container, PageHeader} from '@/components/ui'
import {CtaBand} from '@/components/cta-band'

export const metadata: Metadata = {
  title: 'Catalogue des produits',
  description: 'Caméras, contrôle d’accès, onduleurs, panneaux solaires : les produits que nous installons. Demandez votre devis.',
}

export default async function CataloguePage() {
  const [metiers, settings] = await Promise.all([getMetiers(), getSettings()])
  const catalogue = metiers.filter((m) => m.aCatalogue)
  return (
    <>
      <PageHeader
        title="Catalogue des produits"
        intro="Choisissez vos produits, ajoutez-les à votre demande et recevez un devis détaillé."
        breadcrumb={[{label: 'Accueil', href: '/'}, {label: 'Catalogue'}]}
      />
      <Container className="space-y-14 py-12">
        {catalogue.map((m) => (
          <section key={m.slug}>
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink/15 pb-3">
              <h2 className="text-2xl font-bold">
                <Link href={`/produits/${m.slug}`} className="hover:underline underline-offset-4">{m.title}</Link>
              </h2>
              {m.accroche && <p className="text-steel">{m.accroche}</p>}
            </div>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {m.categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/produits/${m.slug}/${c.slug}`} className="block rounded-lg border border-ink/10 bg-white px-5 py-4 font-semibold transition-colors hover:border-ink">
                    {c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </Container>
      <CtaBand settings={settings} title="Vous ne trouvez pas un produit ?" text="Nous pouvons le fournir ou proposer une alternative. Décrivez-nous votre besoin." />
    </>
  )
}
