import type {Metadata} from 'next'
import Link from 'next/link'
import {notFound, redirect} from 'next/navigation'
import {getMetier} from '@/lib/data'
import {seoMeta} from '@/lib/seo'
import {Container, PageHeader} from '@/components/ui'
import {CategoryCatalog} from '@/components/category-catalog'

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
	return (
		<>
			<PageHeader
				title={m.title}
				intro={m.accroche}
				breadcrumb={[{label: 'Accueil', href: '/'}, {label: 'Catalogue', href: '/produits'}, {label: m.title}]}
			/>
			<Container className="py-12">
				<CategoryCatalog metierSlug={m.slug} categories={m.categories}/>
				<p className="mt-8 text-steel">
					Présentation du service : <Link href={`/services/${m.slug}`}
																					className="font-semibold text-ink underline underline-offset-4">{m.title}</Link>
				</p>
			</Container>
		</>
	)
}
