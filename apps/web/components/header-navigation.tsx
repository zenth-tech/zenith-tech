"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MenuMetier } from "@/lib/types";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const links = [
  { label: "Réalisations", href: "/realisations" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
];

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

const menuLinkClass =
  "font-display text-sm font-semibold text-ink/80 transition-colors hover:text-ink";

export function HeaderNavigation({ menu }: { menu: MenuMetier[] }) {
  const pathname = usePathname();
  const servicesActive = isActive(pathname, "/services");
  const catalogueActive = isActive(pathname, "/produits");

  return (
    <NavigationMenu
      aria-label="Navigation principale"
      className="hidden md:flex"
    >
      <NavigationMenuList className="md:gap-1">
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={`${menuLinkClass} ${servicesActive ? "relative bg-mist text-ink after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-solar" : ""}`}
            aria-current={servicesActive ? "page" : undefined}
          >
            Services
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[30rem] grid-cols-2 gap-1">
              {menu.map((metier) => {
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
                      className={`block rounded-lg px-3 py-3 ${active ? "bg-mist" : "hover:bg-mist/70"}`}
                    >
                      <span className="font-display text-sm font-semibold text-ink">
                        {metier.title}
                      </span>
                      {metier.accroche && (
                        <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-steel">
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

        <NavigationMenuItem>
          <NavigationMenuTrigger
            className={`${menuLinkClass} ${catalogueActive ? "relative bg-mist text-ink after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-solar" : ""}`}
            aria-current={catalogueActive ? "page" : undefined}
          >
            Catalogue
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[30rem] grid-cols-2 gap-1">
              {menu
                .filter((metier) => metier.aCatalogue)
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
                        className={`block rounded-lg px-3 py-3 ${active ? "bg-mist" : "hover:bg-mist/70"}`}
                      >
                        <span className="font-display text-sm font-semibold text-ink">
                          {metier.title}
                        </span>
                        {metier.accroche && (
                          <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-steel">
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

        {links.map(({ label, href }) => {
          const active = isActive(pathname, href);
          return (
            <NavigationMenuItem key={href}>
              <NavigationMenuLink
                className={`${navigationMenuTriggerStyle()} ${menuLinkClass} ${active ? "relative bg-mist text-ink after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:bg-solar" : ""}`}
                render={
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                  />
                }
              >
                {label}
              </NavigationMenuLink>
            </NavigationMenuItem>
          );
        })}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
