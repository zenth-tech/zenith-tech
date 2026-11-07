'use client'

import { useRef, type ReactNode } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

export type ScrollRevealProps = {
  children: ReactNode
  className?: string
  /**
   * Sélecteur optionnel pour animer les éléments enfants en cascade (ex: '[data-reveal-item]')
   */
  staggerSelector?: string
  /**
   * Délai entre chaque élément enfant (en secondes)
   */
  stagger?: number
  /**
   * Déplacement vertical initial (en pixels)
   */
  y?: number
  /**
   * Durée de l'animation (en secondes)
   */
  duration?: number
  /**
   * Pourcentage de visibilité dans le viewport pour déclencher l'animation (0.1 = 10%)
   */
  threshold?: number
  /**
   * Marge d'anticipation pour déclencher l'animation
   */
  rootMargin?: string
}

export function ScrollReveal({
  children,
  className = '',
  staggerSelector,
  stagger = 0.08,
  y = 28,
  duration = 0.65,
  threshold = 0.1,
  rootMargin = '0px 0px -40px 0px',
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const container = containerRef.current
      if (!container) return

      // Accessibilité : ne rien masquer si l'utilisateur préfère des mouvements réduits
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return
      }

      const staggerItems = staggerSelector
        ? Array.from(container.querySelectorAll<HTMLElement>(staggerSelector))
        : []

      const header = container.querySelector<HTMLElement>('[data-reveal-header]')
      const mainTarget = header ?? (staggerItems.length > 0 ? null : container)

      // Initialisation discrète côté client
      if (mainTarget) {
        gsap.set(mainTarget, { autoAlpha: 0, y })
      }
      if (staggerItems.length > 0) {
        gsap.set(staggerItems, { autoAlpha: 0, y: Math.round(y * 0.8) })
      }

      let hasAnimated = false

      const reveal = () => {
        if (hasAnimated) return
        hasAnimated = true

        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })

        if (mainTarget) {
          tl.to(mainTarget, {
            autoAlpha: 1,
            y: 0,
            duration,
            overwrite: 'auto',
          })
        }

        if (staggerItems.length > 0) {
          tl.to(
            staggerItems,
            {
              autoAlpha: 1,
              y: 0,
              duration: duration * 0.85,
              stagger,
              overwrite: 'auto',
            },
            mainTarget ? '-=0.35' : 0,
          )
        }
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              reveal()
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold, rootMargin },
      )

      observer.observe(container)

      // Fallback de sécurité : assure l'affichage si l'IntersectionObserver ne s'exécute pas
      const fallbackTimer = setTimeout(() => {
        if (!hasAnimated) reveal()
      }, 2500)

      return () => {
        clearTimeout(fallbackTimer)
        observer.disconnect()
      }
    },
    { scope: containerRef },
  )

  return (
    <div ref={containerRef} data-scroll-reveal className={className}>
      {children}
    </div>
  )
}
