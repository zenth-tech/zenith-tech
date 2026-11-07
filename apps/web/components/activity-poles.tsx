'use client'

import {useRef} from 'react'
import Link from 'next/link'
import {useGSAP} from '@gsap/react'
import gsap from 'gsap'
import {ArrowUpRight, Blocks} from 'lucide-react'
import {Container} from '@/components/ui'
import {SanityImage} from '@/components/sanity-image'
import type {Metier} from '@/lib/types'

gsap.registerPlugin(useGSAP)

export function ActivityPoles({metiers}: {metiers: Metier[]}) {
	const root = useRef<HTMLElement>(null)

	useGSAP(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
		// Si le composant est imbriqué dans ScrollReveal, ScrollReveal gère l'animation de cascade
		if (root.current?.closest('[data-scroll-reveal]')) return

		const cards = gsap.utils.toArray<HTMLElement>('[data-activity-card]')
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return
				gsap.fromTo(
					entry.target,
					{y: 20, autoAlpha: 0},
					{y: 0, autoAlpha: 1, duration: 0.65, ease: 'power2.out', overwrite: true},
				)
				observer.unobserve(entry.target)
			})
		}, {threshold: 0.15})

		cards.forEach((card) => observer.observe(card))
		return () => observer.disconnect()
	}, {scope: root})

	const animateImage = (card: HTMLElement, scale: number) => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
		const image = card.querySelector<HTMLElement>('[data-activity-image]')
		if (image) gsap.to(image, {scale, duration: 0.7, ease: 'power2.out', overwrite: 'auto'})
	}

	return (
		<section ref={root} className="bg-white py-14 sm:py-20">
			<Container>
				<div data-reveal-header className="mb-8 max-w-2xl sm:mb-10">
					<p className="text-sm font-bold uppercase tracking-[0.16em] text-solar-deep">Nos pôles d’activité</p>
					<h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">Six domaines, un seul interlocuteur</h2>
					<p className="mt-3 text-steel">Du projet à la maintenance, une même équipe s’occupe de vos installations.</p>
				</div>

				<ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{metiers.map((metier, index) => {
						const hasImage = Boolean(metier.image?.asset?.url)

						return (
							<li key={metier.slug} data-activity-card>
								<Link
									href={`/services/${metier.slug}`}
									className="group/activity relative isolate block aspect-[4/5] overflow-hidden rounded-2xl bg-ink text-white focus-visible:outline-offset-4"
									onPointerEnter={(event) => animateImage(event.currentTarget, 1.045)}
									onPointerLeave={(event) => animateImage(event.currentTarget, 1)}
								>
									{hasImage ? (
										<div data-activity-image className="absolute inset-0">
											<SanityImage
												image={metier.image}
												ratio="h-full"
												className="h-full"
												imageClassName="transition-[filter] duration-500 group-hover/activity:brightness-90"
												sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
												fallbackAlt={metier.title}
											/>
										</div>
									) : (
										<div data-activity-image className="placeholder-bg absolute inset-0 flex items-center justify-center text-white/70">
											<Blocks aria-hidden="true" size={76} strokeWidth={0.8}/>
										</div>
									)}
									<div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/5"/>

									<span className="absolute left-5 top-5 rounded-full border border-white/40 bg-ink/30 px-3 py-1 text-xs font-semibold tracking-wider text-white backdrop-blur-sm">
										PÔLE {String(index + 1).padStart(2, '0')}
									</span>

									<div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
										<div>
											<h3 className="font-display text-2xl font-bold leading-tight sm:text-[1.7rem]">{metier.title}</h3>
											{metier.accroche && <p className="mt-2 line-clamp-2 max-w-sm text-sm leading-relaxed text-white/80">{metier.accroche}</p>}
										</div>
										<span aria-hidden="true" className="grid size-11 shrink-0 place-items-center rounded-full border border-white/50 transition-colors group-hover/activity:border-solar group-hover/activity:bg-solar group-hover/activity:text-ink">
											<ArrowUpRight size={20}/>
										</span>
									</div>
								</Link>
							</li>
						)
					})}
				</ul>
			</Container>
		</section>
	)
}
