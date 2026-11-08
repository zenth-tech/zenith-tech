import {QuoteProvider} from '@/lib/quote'
import {getSettings} from '@/lib/data'
import {digits, SITE_URL} from '@/lib/site'
import {SiteHeader} from '@/components/site-header'
import {SiteFooter} from '@/components/site-footer'
import {MobileBar} from '@/components/mobile-bar'

export default async function SiteLayout({children}: {children: React.ReactNode}) {
	const s = await getSettings()
	const jsonLd = {
		'@context': 'https://schema.org',
		'@type': 'LocalBusiness',
		name: s.nomEntreprise ?? 'ZENITH TECH-SARL',
		url: SITE_URL,
		telephone: s.telephone?.length ? `+${digits(s.telephone?.[0])}` : undefined,
		email: s.email,
		address: {
			'@type': 'PostalAddress',
			streetAddress: s.adresse,
			addressLocality: s.ville ?? 'Bamako',
			addressCountry: 'ML',
		},
		areaServed: s.zoneCouverture ?? 'Mali',
	}
	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}/>
			<QuoteProvider>
				<a href="#contenu"
				   className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-solar focus:px-4 focus:py-2 focus:font-semibold">
					Aller au contenu
				</a>
				<SiteHeader/>
				<main id="contenu">{children}</main>
				<SiteFooter/>
				<MobileBar settings={s}/>
			</QuoteProvider>
		</>
	)
}

