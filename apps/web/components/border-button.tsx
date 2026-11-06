'use client'

import Link from 'next/link'
import {useEffect, useRef, useState, type ReactNode} from 'react'
import gsap from 'gsap'
import {useGSAP} from '@gsap/react'

gsap.registerPlugin(useGSAP)

type Props = {
  href: string
  children: ReactNode
  /** Contrôle l'affichage (ex : "hidden sm:inline-flex"). */
  className?: string
  size?: 'sm' | 'md'
}

const INSET = 2.5 // le trait reste entièrement dans le bouton
const RADIUS = 6
const STROKE = 2

/**
 * Bouton principal (« Demander un devis ») avec une bordure animée par GSAP :
 *  - un trait de lumière fait le tour du bouton en continu ;
 *  - au survol ou au focus clavier, la bordure se dessine en entier.
 * Avec « réduire les animations » activé dans le système, le bouton reste statique.
 */
export function BorderButton({href, children, className = 'inline-flex', size = 'md'}: Props) {
  const root = useRef<HTMLAnchorElement>(null)
  const orbit = useRef<SVGRectElement>(null)
  const draw = useRef<SVGRectElement>(null)
  const hover = useRef<gsap.core.Tween | null>(null)
  const [box, setBox] = useState<{w: number; h: number} | null>(null)

  // Mesure le bouton pour que le tracé SVG épouse exactement ses bords
  useEffect(() => {
    const el = root.current
    if (!el) return
    const measure = () => setBox({w: el.offsetWidth, h: el.offsetHeight})
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useGSAP(
    () => {
      if (!box || !orbit.current || !draw.current) return
      const length = orbit.current.getTotalLength()
      const segment = length * 0.2
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Trait de lumière en boucle (la période du motif = la longueur du tour, donc sans coupure)
        gsap.set(orbit.current, {opacity: 1, strokeDasharray: `${segment} ${length - segment}`, strokeDashoffset: 0})
        gsap.to(orbit.current, {strokeDashoffset: -length, duration: 3.4, ease: 'none', repeat: -1})

        // Bordure complète dessinée au survol
        gsap.set(draw.current, {opacity: 1, strokeDasharray: `${length} ${length}`, strokeDashoffset: length})
        hover.current = gsap.to(draw.current, {strokeDashoffset: 0, duration: 0.55, ease: 'power2.out', paused: true})
      })

      return () => {
        mm.revert()
        hover.current = null
      }
    },
    {dependencies: [box?.w, box?.h], scope: root, revertOnUpdate: true},
  )

  const sizing = size === 'sm' ? 'min-h-10 px-4 py-2 text-sm' : 'min-h-11 px-5 py-2.5 text-[0.95rem]'

  return (
    <Link
      ref={root}
      href={href}
      onMouseEnter={() => hover.current?.play()}
      onMouseLeave={() => hover.current?.reverse()}
      onFocus={() => hover.current?.play()}
      onBlur={() => hover.current?.reverse()}
      className={`${className} relative isolate items-center justify-center gap-2 rounded-md bg-solar font-semibold text-ink transition-colors hover:bg-[#f7b55c] ${sizing}`}
    >
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      {box && (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0"
          width={box.w}
          height={box.h}
          viewBox={`0 0 ${box.w} ${box.h}`}
          fill="none"
        >
          {/* Embout droit (butt) : avec un embout rond, un point resterait visible au départ du tracé */}
          <rect ref={draw} x={INSET} y={INSET} width={box.w - INSET * 2} height={box.h - INSET * 2} rx={RADIUS - INSET + 1}
            stroke="#10243b" strokeWidth={STROKE} strokeLinecap="butt" style={{opacity: 0}} />
          <rect ref={orbit} x={INSET} y={INSET} width={box.w - INSET * 2} height={box.h - INSET * 2} rx={RADIUS - INSET + 1}
            stroke="#10243b" strokeWidth={STROKE} strokeLinecap="round" style={{opacity: 0}} />
        </svg>
      )}
    </Link>
  )
}
