"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useQuery } from "@tanstack/react-query";
import { QuoteCount } from "./quote-link";
import { getMenu } from "@/lib/data";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const { data } = useQuery({
    queryKey: ["menu"],
    queryFn: getMenu,
  });
  const menu = data ?? [];
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const link =
    "block py-3 font-display text-lg font-semibold transition-colors";
  const activeLink = "text-solar-deep";
  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="menu-mobile"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-11 items-center rounded-lg border border-ink/15 bg-white px-4 font-display text-sm font-semibold text-ink transition-colors hover:border-ink/30 hover:bg-mist"
      >
        {open ? "Fermer" : "Menu"}
      </button>
      {open &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            id="menu-mobile"
            className="fixed inset-x-0 bottom-0 top-[4.5rem] z-[60] overflow-y-auto bg-paper px-5 pb-28 pt-4 lg:hidden"
          >
            <nav aria-label="Menu principal" className="divide-y divide-ink/10">
              <details className="group" open={isActive("/services")}>
                <summary
                  className={`${link} flex cursor-pointer list-none items-center justify-between ${isActive("/services") ? activeLink : "text-ink"}`}
                >
                  Services{" "}
                  <span
                    aria-hidden
                    className="text-steel group-open:rotate-180"
                  >
                    ⌄
                  </span>
                </summary>
                <ul className="pb-3 pl-3">
                  {menu.map((m) => {
                    const href = `/services/${m.slug}`;
                    const active = isActive(href);
                    return (
                      <li key={m.slug}>
                        <Link
                          href={href}
                          aria-current={active ? "page" : undefined}
                          className={`block border-l-2 py-2 pl-3 text-sm transition-colors ${active ? "border-solar font-semibold text-ink" : "border-transparent text-steel hover:text-ink"}`}
                        >
                          {m.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </details>
              <details className="group" open={isActive("/produits")}>
                <summary
                  className={`${link} flex cursor-pointer list-none items-center justify-between ${isActive("/produits") ? activeLink : "text-ink"}`}
                >
                  Catalogue produits{" "}
                  <span
                    aria-hidden
                    className="text-steel group-open:rotate-180"
                  >
                    ⌄
                  </span>
                </summary>
                <ul className="pb-3 pl-3">
                  {menu
                    .filter((m) => m.aCatalogue)
                    .map((m) => (
                      <li key={m.slug} className="py-1">
                        <Link
                          href={`/produits/${m.slug}`}
                          aria-current={
                            isActive(`/produits/${m.slug}`) ? "page" : undefined
                          }
                          className={`block border-l-2 py-1 pl-3 font-semibold ${isActive(`/produits/${m.slug}`) ? "border-solar text-ink" : "border-transparent text-ink"}`}
                        >
                          {m.title}
                        </Link>
                        <ul className="pl-3">
                          {m.categories.map((c) => (
                            <li key={c.slug}>
                              <Link
                                href={`/produits/${m.slug}/${c.slug}`}
                                aria-current={
                                  isActive(`/produits/${m.slug}/${c.slug}`)
                                    ? "page"
                                    : undefined
                                }
                                className={`block border-l-2 py-1.5 pl-3 text-sm ${isActive(`/produits/${m.slug}/${c.slug}`) ? "border-solar font-semibold text-ink" : "border-transparent text-steel"}`}
                              >
                                {c.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </li>
                    ))}
                </ul>
              </details>
              <Link
                href="/realisations"
                aria-current={isActive("/realisations") ? "page" : undefined}
                className={`${link} ${isActive("/realisations") ? activeLink : "text-ink"}`}
              >
                Réalisations
              </Link>
              <Link
                href="/a-propos"
                aria-current={isActive("/a-propos") ? "page" : undefined}
                className={`${link} ${isActive("/a-propos") ? activeLink : "text-ink"}`}
              >
                À propos
              </Link>
              <Link
                href="/contact"
                aria-current={isActive("/contact") ? "page" : undefined}
                className={`${link} ${isActive("/contact") ? activeLink : "text-ink"}`}
              >
                Contact
              </Link>
              <Link
                href="/devis"
                aria-current={isActive("/devis") ? "page" : undefined}
                className={`${link} flex items-center gap-2 ${isActive("/devis") ? activeLink : "text-ink"}`}
              >
                Ma demande de devis <QuoteCount />
              </Link>
            </nav>
          </div>,
          document.body,
        )}
    </div>
  );
}
