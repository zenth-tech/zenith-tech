import Link from "next/link";
import { getMenu, getSettings } from "@/lib/data";
import { Container } from "./ui";
import { MobileMenu } from "./mobile-menu";
import { QuoteLink } from "./quote-link";
import { SanityImage } from "./sanity-image";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "./ui/navigation-menu";
import { ListItem } from "./list-item";

const navLink =
  "inline-flex min-h-10 items-center rounded-md px-3 text-[0.95rem] font-semibold text-ink/85 transition-colors hover:bg-mist hover:text-ink";

// Menus déroulants sans JavaScript : ouverts au survol et au focus clavier.
const panel =
  "invisible absolute left-0 top-full z-50 pt-2 opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100";

export async function SiteHeader() {
  const [menu, settings] = await Promise.all([getMenu(), getSettings()]);
  console.log("menu", menu);
  console.log("settings", settings);
  const catalogue = menu.filter((m) => m.aCatalogue);

  return (
    <header className="sticky top-0 z-50 border-b border-ink/70 bg-white/70 backdrop-blur-3xl">
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
              <NavigationMenuTrigger
                render={
                  <Link href="/" className="font-bricolage">
                    Accueil
                  </Link>
                }
                className="font-bricolage"
              />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="font-bricolage">
                Services
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="w-80 rounded-lg border border-ink/10 p-2 shadow-lg">
                  {menu.map((m) => (
                    <ListItem key={m.slug}>
                      <Link
                        href={`/services/${m.slug}`}
                        className="block rounded-md px-3 py-2 hover:bg-mist"
                      >
                        <span className="block font-semibold">{m.title}</span>
                        {m.accroche && (
                          <span className="block text-sm text-steel">
                            {m.accroche}
                          </span>
                        )}
                      </Link>
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center gap-3">
          <QuoteLink className="hidden sm:inline-flex" />
          <MobileMenu menu={menu} />
        </div>
      </Container>
    </header>
  );
}
