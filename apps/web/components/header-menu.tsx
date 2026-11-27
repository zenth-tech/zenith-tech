"use client";

import Link from "next/link";
import { useState } from "react";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { MenuQueryResult } from "@/lib/sanity/types";

export type MenuPole = NonNullable<MenuQueryResult>[number];

const isActiveHref = (pathname: string, href: string) =>
  pathname === href || pathname.startsWith(`${href}/`);

/* ------------------------------------------------------------------ Services */
/** Contenu du menu « Services » : chaque pôle, avec ses sous-pôles en liens en dessous. */
export function ServicesMenuContent({
  menu,
  pathname,
}: {
  menu?: MenuPole[];
  pathname: string;
}) {
  return (
    <ul className="grid w-[50rem] grid-cols-3 gap-x-2 gap-y-3 p-1">
      {menu?.map((pole) => {
        const href = `/services/${pole.slug}`;
        const active = isActiveHref(pathname, href);
        return (
          <li
            key={pole.slug}
            className={cn(
              "rounded-lg px-3 py-3",
              active ? "bg-mist" : "hover:bg-mist/70",
            )}
          >
            {/* Le lien du pôle et ceux des sous-pôles sont frères : un lien ne peut pas contenir un autre lien */}
            <NavigationMenuLink
              render={
                <Link href={href} aria-current={active ? "page" : undefined} />
              }
              className="block"
            >
              <span className="font-display text-sm font-semibold text-ink">
                {pole.title}
              </span>
              {pole.accroche && (
                <span className="mt-1 line-clamp-2 block text-xs leading-relaxed text-steel">
                  {pole.accroche}
                </span>
              )}
            </NavigationMenuLink>
            {pole.sousPoles.length > 0 && (
              <ul className="mt-2 space-y-0.5 border-t border-ink/10 pt-2">
                {pole.sousPoles.map((s) => {
                  const sHref = `/services/${s.slug}`;
                  return (
                    <li key={s.slug}>
                      <NavigationMenuLink
                        render={
                          <Link
                            href={sHref}
                            aria-current={
                              isActiveHref(pathname, sHref) ? "page" : undefined
                            }
                          />
                        }
                        className="block rounded px-1 py-1 text-xs text-steel hover:text-ink hover:underline"
                      >
                        {s.title}
                      </NavigationMenuLink>
                    </li>
                  );
                })}
              </ul>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* ----------------------------------------------------------------- Catalogue */
/** Pôles qui ont un catalogue, avec uniquement les sous-pôles et catégories à afficher. */
export function cataloguePoles(menu?: MenuPole[]) {
  return (menu ?? [])
    .map((p) => ({
      ...p,
      categories: p.aCatalogue ? p.categories : [],
      sousPoles: p.sousPoles.filter(
        (s) => s.aCatalogue && s.categories.length > 0,
      ),
    }))
    .filter((p) => p.sousPoles.length > 0 || p.categories.length > 0);
}

/** Contenu du menu « Catalogue » : les pôles à gauche, les sous-pôles et catégories du pôle survolé à droite. */
export function CatalogueMenuContent({
  menu,
  pathname,
}: {
  menu?: MenuPole[];
  pathname: string;
}) {
  const poles = cataloguePoles(menu);
  const [active, setActive] = useState(0);
  const current = poles[active] ?? poles[0];
  if (!current) return null;

  const catLink =
    "block rounded px-1 py-0.5 text-sm text-steel hover:text-ink hover:underline";
  return (
    <div className="grid w-[58rem] grid-cols-[15rem_1fr] gap-4">
      <ul className="space-y-1 border-r border-ink/10 pr-3">
        {poles.map((p, i) => {
          const href = `/produits/${p.slug}`;
          return (
            <li key={p.slug}>
              <NavigationMenuLink
                render={
                  <Link
                    href={href}
                    aria-current={
                      isActiveHref(pathname, href) ? "page" : undefined
                    }
                  />
                }
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className={cn(
                  "block rounded-lg px-3 py-2.5",
                  i === active ? "bg-mist" : "hover:bg-mist/70",
                )}
              >
                <span className="font-display text-sm font-semibold leading-snug text-ink">
                  {p.title}
                </span>
              </NavigationMenuLink>
            </li>
          );
        })}
        <li className="border-t border-ink/10 pt-2">
          <NavigationMenuLink
            render={<Link href="/produits" />}
            className="block px-3 py-1.5 text-sm font-semibold underline underline-offset-4"
          >
            Voir tout le catalogue
          </NavigationMenuLink>
        </li>
      </ul>

      <div className="min-h-64 py-1">
        {current.sousPoles.length > 0 ? (
          <div className="grid grid-cols-3 gap-x-6 gap-y-5">
            {current.sousPoles.map((s) => (
              <div key={s.slug}>
                <NavigationMenuLink
                  render={<Link href={`/produits/${s.slug}`} />}
                  className="block px-1 py-0.5 font-display text-sm font-bold leading-snug text-ink hover:underline"
                >
                  {s.title}
                </NavigationMenuLink>
                <ul className="mt-1 space-y-0.5">
                  {s.categories.map((c) => (
                    <li key={c.slug}>
                      <NavigationMenuLink
                        render={<Link href={`/produits/${s.slug}/${c.slug}`} />}
                        className={catLink}
                      >
                        {c.title}
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : (
          <ul className="grid grid-cols-3 gap-x-6 gap-y-0.5">
            {current.categories.map((c) => (
              <li key={c.slug}>
                <NavigationMenuLink
                  render={<Link href={`/produits/${current.slug}/${c.slug}`} />}
                  className={catLink}
                >
                  {c.title}
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
