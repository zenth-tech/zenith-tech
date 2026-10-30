import Link from 'next/link'
import {getMenu, getSettings} from '@/lib/data'
import {Container} from './ui'
import {MobileMenu} from './mobile-menu'
import {QuoteLink} from './quote-link'
import {SanityImage} from './sanity-image'

const navLink =
  'inline-flex min-h-10 items-center rounded-md px-3 text-[0.95rem] font-semibold text-ink/85 transition-colors hover:bg-mist hover:text-ink'

// Menus déroulants sans JavaScript : ouverts au survol et au focus clavier.
const panel =
  'invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100'

export async function SiteHeader() {
  const [menu, settings] = await Promise.all([getMenu(), getSettings()])
  console.log('menu', menu)
  console.log('settings', settings)
  const catalogue = menu.filter((m) => m.aCatalogue)

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2.5" aria-label={`${settings.nomEntreprise ?? 'Accueil'} : accueil`}>
          {settings.logo?.asset ? (
            <div className="w-32"><SanityImage image={settings.logo} ratio="aspect-[3/1]" sizes="128px" /></div>
          ) : (
            <>
              <span aria-hidden className="grid h-8 w-8 place-items-center rounded bg-ink font-display text-lg font-bold text-solar">Z</span>
              <span className="whitespace-nowrap font-display text-lg font-bold tracking-tight">Zenith Tech</span>
            </>
          )}
        </Link>

        <nav aria-label="Menu principal" className="hidden items-center gap-1 lg:flex">
          <div className="group relative">
            <Link href="/services" className={navLink}>Services</Link>
            <div className={panel}>
              <ul className="w-80 rounded-lg border border-ink/10 bg-white p-2 shadow-lg">
                {menu.map((m) => (
                  <li key={m.slug}>
                    <Link href={`/services/${m.slug}`} className="block rounded-md px-3 py-2 hover:bg-mist">
                      <span className="block font-semibold">{m.title}</span>
                      {m.accroche && <span className="block text-sm text-steel">{m.accroche}</span>}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="group relative">
            <Link href="/produits" className={navLink}>Catalogue</Link>
            <div className={`${panel} -left-24`}>
              <div className="grid w-[44rem] max-w-[90vw] grid-cols-3 gap-6 rounded-lg border border-ink/10 bg-white p-6 shadow-lg">
                {catalogue.map((m) => (
                  <div key={m.slug}>
                    <Link href={`/produits/${m.slug}`} className="font-display font-bold hover:underline">{m.title}</Link>
                    <ul className="mt-2 space-y-1">
                      {m.categories.map((c) => (
                        <li key={c.slug}>
                          <Link href={`/produits/${m.slug}/${c.slug}`} className="text-sm text-steel hover:text-ink hover:underline">{c.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="col-span-3 border-t border-ink/10 pt-3">
                  <Link href="/produits" className="text-sm font-semibold underline underline-offset-4">Voir tout le catalogue</Link>
                </div>
              </div>
            </div>
          </div>

          <Link href="/realisations" className={navLink}>Réalisations</Link>
          <Link href="/a-propos" className={navLink}>À propos</Link>
          <Link href="/contact" className={navLink}>Contact</Link>
        </nav>

        <div className="flex items-center gap-3">
          <QuoteLink className="hidden sm:inline-flex" />
          <MobileMenu menu={menu} />
        </div>
      </Container>
    </header>
  )
}
