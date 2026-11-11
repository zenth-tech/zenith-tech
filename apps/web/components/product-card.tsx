"use client";

import type { ProductCard as P } from "@/lib/types";
import { SanityImage } from "@/components/sanity-image";
import Link from "next/link";
import { AddToQuoteButton } from "@/components/add-to-quote";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { productHref } from "@/lib/site";
import { cn } from "@/lib/utils";

export function ProductCard({
  product: p,
  className,
}: {
  product: P;
  className?: string;
}) {
  const root = useRef<HTMLElement>(null);

  const specs = (p.caracteristiques ?? [])
    .filter((c) => c.cle && c.valeur)
    .slice(0, 3);

  const { contextSafe } = useGSAP({ scope: root });

  const animateImage = contextSafe((card: HTMLElement, scale: number) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const image = card.querySelector<HTMLElement>("[data-product-image]");

    if (!image) return;

    gsap.to(image, {
      scale,
      duration: 0.65,
      ease: "power3.out",
      overwrite: "auto",
    });
  });

  return (
    <article
      ref={root}
      className={cn(
        "relative flex h-full min-h-[19rem] flex-col overflow-hidden rounded-lg border border-ink/10 bg-white shadow-md",
        className,
      )}
      onPointerEnter={(event) => animateImage(event.currentTarget, 1.06)}
      onPointerLeave={(event) => animateImage(event.currentTarget, 1)}
      onFocus={(event) => animateImage(event.currentTarget, 1.06)}
      onBlur={(event) => animateImage(event.currentTarget, 1)}
    >
      {/* Image du produit */}
      <div
        data-product-image
        className="relative h-40 w-full shrink-0 overflow-hidden sm:h-44"
      >
        <SanityImage
          image={p.image}
          fallbackAlt={p.name ?? undefined}
          ratio="h-full"
          className="bg-transparent"
          imageClassName="h-full object-contain"
          sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>

      {/* Contenu de la carte */}
      <div className="flex flex-1 flex-col p-2">
        {/* Informations du produit */}
        <div className="flex-1">
          {p.marque && <p className="text-xs text-steel">{p.marque}</p>}

          <h3 className="text-base line-clamp-1 font-bold leading-tight">
            <Link
              href={productHref(p)}
              className="after:absolute after:inset-0"
            >
              {p.name}
            </Link>
          </h3>

          {p.accroche && (
            <p className="mt-0.5 font-poppins line-clamp-2 text-xs leading-relaxed text-steel">
              {p.accroche}
            </p>
          )}

          {specs.length > 0 && (
            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-0 text-xs">
              {specs.map((c) => (
                <div key={c.cle} className="contents">
                  <dt className="text-steel">{c.cle}</dt>
                  <dd className="font-semibold">{c.valeur}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {/* Bouton d'ajout au devis */}
        <div className="relative z-10 pt-2">
          <AddToQuoteButton
            sku={p.sku!}
            name={p.name!}
            url={productHref(p)}
            size="sm"
            className="w-full rounded-2xl"
          />
        </div>
      </div>
    </article>
  );
}
