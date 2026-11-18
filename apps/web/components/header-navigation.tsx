"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { MenuQueryResult } from "@/lib/sanity/types";
import { getMenu } from "@/lib/data";

const links = [
  { label: "Réalisations", href: "/realisations" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Barre à deux moitiés qui partent du centre vers l'extérieur.
 * - Positionnée en bas du lien (bottom-0)
 * - Pilotée par le contexte `group/link` du lien parent
 */
function AnimatedBar({
  active,
  isTrigger = false,
}: {
  active: boolean;
  isTrigger?: boolean;
}) {
  const half = cn(
    "h-full w-1/2 bg-solar transition-transform duration-300 ease-out",
    active
      ? "scale-x-100"
      : cn(
          "scale-x-0 group-hover/link:scale-x-100",
          // Garde la barre pleine quand un dropdown est ouvert
          isTrigger && "group-data-[state=open]/link:scale-x-100",
        ),
  );

  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-x-3 bottom-0 flex h-0.5"
    >
      <span className={cn(half, "origin-right")} />
      <span className={cn(half, "origin-left")} />
    </span>
  );
}

const menuLinkClass =
  "relative font-display text-sm font-semibold transition-colors";

export function HeaderNavigation({ Pmenu }: { Pmenu?: MenuQueryResult }) {
  const pathname = usePathname();
  const servicesActive = isActive(pathname, "/services");
  const catalogueActive = isActive(pathname, "/produits");

  const { data: menu } = useQuery({
    queryKey: ["menu"],
    queryFn: getMenu,
  });

  return (
    <NavigationMenu
      aria-label="Navigation principale"
      className="hidden md:flex font-poppins"
    >
      <NavigationMenuList className="md:gap-0">
        {/* ---------- Services ---------- */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className="group/link relative"
            aria-current={servicesActive ? "page" : undefined}
          >
            <AnimatedBar active={servicesActive} isTrigger />
            <span className="transition-colors duration-150 font-semibold font-poppins group-hover/link:text-solar">
              Services
            </span>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="shadow-2xl">
            <ul className="grid w-[50rem] grid-cols-3 gap-1">
              {menu?.map((metier) => {
                const href = `/services/${metier.slug}`;
                const active = isActive(pathname, href);
                return (
                  <li key={metier.slug}>
                    <NavigationMenuLink
                      render={
                        <Link
                          href={href}
                          aria-current={active ? "page" : undefined}
                        />
                      }
                      className={cn(
                        "block rounded-lg px-3 py-3",
                        active ? "bg-mist" : "hover:bg-mist/70",
                      )}
                    >
                      <span className="font-display text-sm font-semibold text-ink">
                        {metier.title}
                      </span>
                      {metier.accroche && (
                        <span className="mt-1 font-poppins line-clamp-2 block text-xs leading-relaxed text-steel">
                          {metier.accroche}
                        </span>
                      )}
                    </NavigationMenuLink>
                  </li>
                );
              })}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* ---------- Catalogue ---------- */}
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className="group/link relative"
            aria-current={catalogueActive ? "page" : undefined}
          >
            <AnimatedBar active={catalogueActive} isTrigger />
            <span className="transition-colors duration-150 font-semibold font-poppins group-hover/link:text-solar">
              Catalogue
            </span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[50rem] grid-cols-3 gap-1">
              {menu
                ?.filter((metier) => metier.aCatalogue)
                .map((metier) => {
                  const href = `/produits/${metier.slug}`;
                  const active = isActive(pathname, href);
                  return (
                    <li key={metier.slug}>
                      <NavigationMenuLink
                        render={
                          <Link
                            href={href}
                            aria-current={active ? "page" : undefined}
                          />
                        }
                        className={cn(
                          "block rounded-lg px-3 py-3",
                          active ? "bg-mist" : "hover:bg-mist/70",
                        )}
                      >
                        <span className="font-display text-sm font-semibold text-ink">
                          {metier.title}
                        </span>
                        {metier.accroche && (
                          <span className="mt-1 font-poppins line-clamp-2 block text-xs leading-relaxed text-steel">
                            {metier.accroche}
                          </span>
                        )}
                      </NavigationMenuLink>
                    </li>
                  );
                })}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* ---------- Liens simples ---------- */}
        {links.map(({ label, href }) => {
          const active = isActive(pathname, href);
          return (
            <NavigationMenuItem key={href} className="font-poppins md:px-2">
              <NavigationMenuLink
                className={cn("group/link", menuLinkClass)}
                render={
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                  />
                }
              >
                <AnimatedBar active={active} />
                <span
                  className={cn(
                    "transition-colors font-poppins font-semibold group-hover/link:text-solar",
                    active ? "text-ink" : "text-ink/80",
                  )}
                >
                  {label}
                </span>
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
