import Link from 'next/link'
import {getMenu, getSettings} from '@/lib/data'
import {Container} from './ui'
import {MobileMenu} from './mobile-menu'
import {QuoteLink} from './quote-link'
import {SanityImage} from './sanity-image'
import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";

const navLink =
	'inline-flex min-h-10 items-center rounded-md px-3 text-[0.95rem] font-semibold text-ink/85 transition-colors hover:bg-mist hover:text-ink'

// Menus déroulants sans JavaScript : ouverts au survol et au focus clavier.
const panel =
	'invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100'

export async function SiteHeader() {
	const [menu, settings] = await Promise.all([getMenu(), getSettings()])
	const catalogue = menu.filter((m) => m.aCatalogue)
	const navLink = [{label: "Réalisation", href: "/realisations"}, {
		label: "A propos", href: '/a-propos'
	}, {label: "Contact", href: "/contact"}]
	return (
		<header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/95 backdrop-blur">
			<Container className="flex h-16 items-center justify-between gap-6">
				<Link
					href="/"
					className="flex items-center gap-2.5"
					aria-label={`${settings.nomEntreprise ?? "Accueil"} : accueil`}
				>
					{settings.logo?.asset ? (
						<div className="w-32">
							<SanityImage
								image={settings.logo}
								ratio="aspect-[3/1]"
								sizes="128px"
							/>
						</div>
					) : (
						<>
              <span
								aria-hidden
								className="grid h-8 w-8 place-items-center rounded bg-ink font-display text-lg font-bold text-solar"
							>
                Z
              </span>
							<span className="whitespace-nowrap font-display text-lg font-bold tracking-tight">
                Zenith Tech
              </span>
						</>
					)}
				</Link>

				<NavigationMenu>

					<NavigationMenuList>
						<NavigationMenuItem>
							<NavigationMenuTrigger className="font-bricolage">
								Services
							</NavigationMenuTrigger>
							<NavigationMenuContent>
								<ul className="w-80">
									{menu.map((m) => (
										<ListItem key={m.slug} title={m.title} href={`/services/${m.slug}`}>
											{m.accroche}
										</ListItem>
									))}
								</ul>
							</NavigationMenuContent>
						</NavigationMenuItem>

						<NavigationMenuItem>
							<NavigationMenuTrigger>Catalogue</NavigationMenuTrigger>
							<NavigationMenuContent>
								<ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
									{catalogue.map((ct) => (
										<ListItem
											key={ct.slug}
											title={ct.title}
											href={`/produits/${ct.slug}`}
										>
											{ct.accroche}
										</ListItem>
									))}
								</ul>
							</NavigationMenuContent>
						</NavigationMenuItem>
						{navLink.map((item) => (
							<NavigationMenuItem key={item.href}>
								<NavigationMenuLink className={navigationMenuTriggerStyle()}
																		render={<Link href={item.href}>{item.label}</Link>}/>
							</NavigationMenuItem>
						))}

					</NavigationMenuList>
				</NavigationMenu>

				<div className="flex items-center gap-3">
					<QuoteLink className="hidden sm:inline-flex"/>
					<MobileMenu menu={menu}/>
				</div>
			</Container>
		</header>
	)
}

function ListItem({
										title,
										children,
										href,
										...props
									}: React.ComponentPropsWithoutRef<"li"> & { href: string }) {
	return (
		<li {...props}>
			<NavigationMenuLink render={<Link href={href}>
				<div className="flex flex-col gap-1 text-sm">
					<div className="leading-none font-medium">{title}</div>
					<div className="line-clamp-2 text-muted-foreground">{children}</div>
				</div>
			</Link>}/>
		</li>
	)
}
