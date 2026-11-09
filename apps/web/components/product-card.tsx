"use client";

import type { ProductCard as P } from "@/lib/types";
import { SanityImage } from "@/components/sanity-image";
import Link from "next/link";
import { AddToQuoteButton } from "@/components/add-to-quote";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { productHref } from "@/lib/site";

export function ProductCard({ product: p }: { product: P }) {
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
      className="relative flex h-70 md:h-100 flex-col overflow-hidden rounded-lg border border-ink/10 bg-white shadow-md"
      onPointerEnter={(event) => animateImage(event.currentTarget, 1.06)}
      onPointerLeave={(event) => animateImage(event.currentTarget, 1)}
      onFocus={(event) => animateImage(event.currentTarget, 1.06)}
      onBlur={(event) => animateImage(event.currentTarget, 1)}
    >
      {" "}
      <div data-product-image className="h-full w-full">
        <SanityImage
          image={p.image}
          fallbackAlt={p.name ?? undefined}
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        {p.marque && <p className="text-sm text-steel">{p.marque}</p>}
        <h3 className="text-lg font-bold leading-snug">
          <Link href={productHref(p)} className="after:absolute after:inset-0">
            {p.name}
          </Link>
        </h3>
        {p.accroche && (
          <p className="mt-1.5 text-xs md:text-sm leading-relaxed text-steel">
            {p.accroche}
          </p>
        )}
        {specs.length > 0 && (
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
            {specs.map((c) => (
              <div key={c.cle} className="contents">
                <dt className="text-steel">{c.cle}</dt>
                <dd className="font-semibold">{c.valeur}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="relative z-10 mt-auto pt-4">
          <AddToQuoteButton
            sku={p.sku!}
            name={p.name!}
            url={productHref(p)}
            size="sm"
            className="w-full"
          />
        </div>
      </div>
    </article>
  );
}
