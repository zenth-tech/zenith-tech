import Link from 'next/link'
import {getMenu, getSettings} from '@/lib/data'
import {mailHref, telHref, whatsappHref} from '@/lib/site'
import {Container} from './ui'

export async function SiteFooter() {
  const [menu, s] = await Promise.all([getMenu(), getSettings()])
  const col = 'space-y-2 text-sm text-white/75'
  const a = 'hover:text-white hover:underline underline-offset-4'
  return (
    <footer className="mt-20 bg-ink pb-24 text-white lg:pb-0">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl font-bold">{s.nomEntreprise ?? 'Zenith Tech'}</p>
          {s.presentation && <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/75">{s.presentation}</p>}
        </div>
        <div>
          <p className="mb-3 font-display font-bold">Nos services</p>
          <ul className={col}>
            {menu.map((m) => (
              <li key={m.slug}><Link className={a} href={`/services/${m.slug}`}>{m.title}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-3 font-display font-bold">L’entreprise</p>
          <ul className={col}>
            <li><Link className={a} href="/produits">Catalogue</Link></li>
            <li><Link className={a} href="/realisations">Réalisations</Link></li>
            <li><Link className={a} href="/a-propos">À propos</Link></li>
            <li><Link className={a} href="/devis">Demander un devis</Link></li>
            <li><Link className={a} href="/mentions-legales">Mentions légales</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-3 font-display font-bold">Contact</p>
          <ul className={col}>
            {s.adresse && <li>{s.adresse}</li>}
            {s.telephone && <li><a className={a} href={telHref(s)}>{s.telephone?.[0]}</a></li>}
            {s.whatsapp && <li><a className={a} href={whatsappHref(s)} target="_blank" rel="noopener noreferrer">WhatsApp</a></li>}
            {s.email && <li><a className={a} href={mailHref(s)}>{s.email}</a></li>}
            {s.horaires && <li>{s.horaires}</li>}
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-wrap justify-between gap-2 py-5 text-xs text-white/60">
          <span>© {new Date().getFullYear()} {s.nomEntreprise ?? 'ZENITH TECH-SARL'}</span>
          {s.rccm && <span>RCCM : {s.rccm}</span>}
        </Container>
      </div>
    </footer>
  )
}
