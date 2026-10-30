import Link from 'next/link'
import {getClients, getFeaturedProducts, getFeaturedRealisations, getMetiers, getSettings} from '@/lib/data'
import {telHref, whatsappHref} from '@/lib/site'
import {ButtonLink, Container, Section, Viewfinder} from '@/components/ui'
import {SanityImage} from '@/components/sanity-image'
import {ProductCard, RealisationCard} from '@/components/cards'
import {CtaBand} from '@/components/cta-band'

export default async function HomePage() {
  const [settings, metiers, products, realisations, clients] = await Promise.all([
    getSettings(), getMetiers(), getFeaturedProducts(), getFeaturedRealisations(), getClients(),
  ])
  const wa = whatsappHref(settings, 'Bonjour, je souhaite un devis.')
  const tel = telHref(settings)
  const heroImage = realisations.find((r) => r.image?.asset)?.image ?? null

  return (
    <>
      <section className="bg-ink text-white">
        <Container className="grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h1 className="text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-[3.4rem]">
              Sécurité électronique, énergie solaire et infrastructures IT, installées à Bamako
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">
              {settings.presentation ??
                'Nous concevons, installons et maintenons la sécurité et l’énergie de vos bâtiments depuis plus de cinq ans.'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/devis">Demander un devis</ButtonLink>
              <ButtonLink href="/produits" variant="outline-light">Parcourir le catalogue</ButtonLink>
            </div>
            {(wa || tel) && (
              <p className="mt-6 text-sm text-white/70">
                Une question ? Écrivez-nous sur{' '}
                {wa && <a className="font-semibold text-white underline underline-offset-4" href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
                {wa && tel && ' ou appelez le '}
                {tel && <a className="font-semibold text-white underline underline-offset-4" href={tel}>{settings.telephone}</a>}.
              </p>
            )}
          </div>
          <Viewfinder>
            <SanityImage image={heroImage} ratio="aspect-[4/3]" priority sizes="(min-width: 1024px) 40vw, 100vw" className="rounded-lg" />
          </Viewfinder>
        </Container>
      </section>

      <Section title="Six domaines, un seul interlocuteur" intro="Du projet à la maintenance, une même équipe s’occupe de vos installations.">
        <ul className="grid gap-x-10 gap-y-2 sm:grid-cols-2">
          {metiers.map((m) => (
            <li key={m.slug} className="relative border-t border-ink/15 py-5">
              <h3 className="text-xl font-bold">
                <Link href={`/services/${m.slug}`} className="after:absolute after:inset-0 hover:underline underline-offset-4">{m.title}</Link>
              </h3>
              {m.accroche && <p className="mt-1.5 max-w-md text-steel">{m.accroche}</p>}
            </li>
          ))}
        </ul>
      </Section>

      {products.length > 0 && (
        <Section
          title="Produits que nous installons"
          intro="Ajoutez les produits qui vous intéressent à votre demande, nous vous envoyons un devis."
          className="bg-white"
          action={<ButtonLink href="/produits" variant="outline">Tout le catalogue</ButtonLink>}
        >
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </Section>
      )}

      {realisations.length > 0 && (
        <Section
          title="Nos dernières réalisations"
          action={<ButtonLink href="/realisations" variant="outline">Toutes les réalisations</ButtonLink>}
        >
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {realisations.slice(0, 3).map((r) => <RealisationCard key={r._id} item={r} />)}
          </div>
        </Section>
      )}

      {clients.length > 0 && (
        <Section title="Ils nous font confiance" className="bg-white">
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-ink/10 bg-ink/10 sm:grid-cols-4">
            {clients.slice(0, 8).map((c) => (
              <li key={c._id} className="grid min-h-24 place-items-center bg-white p-4 text-center">
                {c.logo?.asset ? (
                  <div className="w-28"><SanityImage image={c.logo} ratio="aspect-[3/2]" sizes="112px" fallbackAlt={c.nom} /></div>
                ) : (
                  <span className="font-display font-bold">{c.nom}</span>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CtaBand settings={settings} />
    </>
  )
}
