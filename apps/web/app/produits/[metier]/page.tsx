import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound, redirect} from 'next/navigation'
import {getMetier} from '@/lib/data'
import {seoMeta} from '@/lib/seo'
import {Container, PageHeader} from '@/components/ui'
import {SanityImage} from "@/components/sanity-image";

type Props = { params: Promise<{ metier: string }> }

export async function generateMetadata({params}: Props): Promise<Metadata> {
	const m = await getMetier((await params).metier)
	return m ? seoMeta(m.seo, `${m.title} : catalogue`, m.accroche) : {}
}

export default async function MetierCataloguePage({params}: Props) {
	const slug = (await params).metier
	const m = await getMetier(slug)
	if (!m) notFound()
	if (!m.aCatalogue) redirect(`/services/${m.slug}`)
	console.log("Metier : ", m.categories)
	return (
		<>
			<PageHeader
				title={m.title}
				intro={m.accroche}
				breadcrumb={[{label: 'Accueil', href: '/'}, {label: 'Catalogue', href: '/produits'}, {label: m.title}]}
			/>
			<Container className="py-12">
				<ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{m.categories.map((c) => (
						<li key={c.slug}>
							<Link href={`/produits/${m.slug}/${c.slug}`}
										className="relative block rounded-lg border border-ink/10 bg-white p-6 transition-colors hover:border-ink">

								<span className="absolute z-30 bottom-4 font-display text-xl font-bold">{c.title}</span>

								{c?.image && <SanityImage className="w-full h-full object-cover" image={c.image}/>}


							</Link>

						</li>
					))}
				</ul>
				<p className="mt-8 text-steel">
					Présentation du service : <Link href={`/services/${m.slug}`}
																					className="font-semibold text-ink underline underline-offset-4">{m.title}</Link>
				</p>
			</Container>
		</>
	)
}
