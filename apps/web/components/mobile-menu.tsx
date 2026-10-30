'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useEffect, useState} from 'react'
import type {MenuMetier} from '@/lib/types'
import {QuoteCount} from './quote-link'

export function MobileMenu({menu}: {menu: MenuMetier[]}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const link = 'block py-3 text-lg font-semibold'
  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="menu-mobile"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 items-center rounded-md border border-ink/20 px-4 text-sm font-semibold"
      >
        {open ? 'Fermer' : 'Menu'}
      </button>
      {open && (
        <div id="menu-mobile" className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-paper px-5 pb-28 pt-4">
          <nav aria-label="Menu principal" className="divide-y divide-ink/10">
            <details className="group">
              <summary className={`${link} flex cursor-pointer list-none items-center justify-between`}>
                Services <span aria-hidden className="text-steel group-open:rotate-180">⌄</span>
              </summary>
              <ul className="pb-3 pl-3">
                {menu.map((m) => (
                  <li key={m.slug}><Link href={`/services/${m.slug}`} className="block py-2 text-steel">{m.title}</Link></li>
                ))}
              </ul>
            </details>
            <details className="group">
              <summary className={`${link} flex cursor-pointer list-none items-center justify-between`}>
                Catalogue produits <span aria-hidden className="text-steel group-open:rotate-180">⌄</span>
              </summary>
              <ul className="pb-3 pl-3">
                {menu.filter((m) => m.aCatalogue).map((m) => (
                  <li key={m.slug} className="py-1">
                    <Link href={`/produits/${m.slug}`} className="block py-1 font-semibold">{m.title}</Link>
                    <ul className="pl-3">
                      {m.categories.map((c) => (
                        <li key={c.slug}>
                          <Link href={`/produits/${m.slug}/${c.slug}`} className="block py-1.5 text-steel">{c.title}</Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </details>
            <Link href="/realisations" className={link}>Réalisations</Link>
            <Link href="/a-propos" className={link}>À propos</Link>
            <Link href="/contact" className={link}>Contact</Link>
            <Link href="/devis" className={`${link} flex items-center gap-2`}>
              Ma demande de devis <QuoteCount />
            </Link>
          </nav>
        </div>
      )}
    </div>
  )
}
