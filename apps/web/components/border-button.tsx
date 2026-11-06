'use client'

import Link from 'next/link'
import {useRef, type ReactNode} from 'react'
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

export function BorderButton({href, children, className = 'inline-flex', size = 'md'}: Props) {
  const root = useRef<HTMLAnchorElement>(null)
  const orbit = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      if (!orbit.current) return
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.to(orbit.current, {rotation: 360, duration: 3.2, ease: 'none', repeat: -1})
      })

      return () => mm.revert()
    },
    {scope: root},
  )

  const sizing = size === 'sm' ? 'min-h-10 px-4 py-2 text-sm' : 'min-h-11 px-5 py-2.5 text-[0.95rem]'

  return (
    <Link
      ref={root}
      href={href}
      className={`${className} group relative isolate items-center justify-center gap-2 overflow-hidden rounded-md font-semibold text-ink ${sizing}`}
    >
      <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
        <span
          ref={orbit}
          className="absolute -inset-[150%]"
          style={{backgroundImage: 'conic-gradient(from 0deg, transparent 0deg 285deg, #f2a33a 305deg, #ffffff 325deg, #1e9e57 345deg, transparent 360deg)'}}
        />
      </span>
      <span aria-hidden="true" className="pointer-events-none absolute inset-[2px] rounded-[calc(0.375rem-2px)] bg-solar transition-colors group-hover:bg-[#f7b55c] group-focus-visible:bg-[#f7b55c]"/>
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </Link>
  )
}
