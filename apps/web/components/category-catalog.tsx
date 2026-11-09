"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ArrowUpRight, Boxes } from "lucide-react";
import { SanityImage } from "@/components/sanity-image";
import { MetierQueryResult } from "@/lib/sanity/types";

gsap.registerPlugin(useGSAP);

type Props = {
  metierSlug: string;
  categories: NonNullable<MetierQueryResult>["categories"];
};

export function CategoryCatalog({ metierSlug, categories }: Props) {
  const root = useRef<HTMLUListElement>(null);
  const { contextSafe } = useGSAP({ scope: root });

  const animateImage = contextSafe((card: HTMLElement, scale: number) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const image = card.querySelector<HTMLElement>("[data-category-image]");
    if (!image) return;
    gsap.to(image, {
      scale,
      duration: 0.65,
      ease: "power3.out",
      overwrite: "auto",
    });
  });

  return (
    <ul ref={root} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => {
        const hasImage = Boolean(category.image?.asset?.url);

        return (
          <li key={category.slug}>
            <Link
              href={`/produits/${metierSlug}/${category.slug}`}
              className="group/card block h-full overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition-colors hover:border-ink/35 focus-visible:border-ink/35"
              onPointerEnter={(event) =>
                animateImage(event.currentTarget, 1.06)
              }
              onPointerLeave={(event) => animateImage(event.currentTarget, 1)}
              onFocus={(event) => animateImage(event.currentTarget, 1.06)}
              onBlur={(event) => animateImage(event.currentTarget, 1)}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-mist">
                {hasImage ? (
                  <div data-category-image className="h-full w-full">
                    <SanityImage
                      image={category.image}
                      ratio="aspect-[4/3]"
                      className="h-full"
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      fallbackAlt={category.title ?? undefined}
                    />
                  </div>
                ) : (
                  <div
                    data-category-image
                    className="placeholder-bg flex h-full w-full flex-col items-center justify-center gap-3 text-steel"
                  >
                    <span
                      aria-hidden="true"
                      className="grid size-14 place-items-center rounded-full bg-white/80 text-ink shadow-sm"
                    >
                      <Boxes size={27} strokeWidth={1.5} />
                    </span>
                    <span className="text-sm font-semibold">
                      Visuel à venir
                    </span>
                  </div>
                )}
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold tracking-wide text-ink shadow-sm">
                  Catégorie
                </span>
              </div>

              <div className="flex min-h-24 items-center justify-between gap-4 px-5 py-4">
                <div>
                  <h2 className="font-display text-xl font-bold leading-snug text-ink">
                    {category.title}
                  </h2>
                  <p className="mt-1 text-sm text-steel">
                    Découvrir les produits
                  </p>
                </div>
                <span
                  aria-hidden="true"
                  className="grid size-10 shrink-0 place-items-center rounded-full border border-ink/10 text-ink transition-colors group-hover/card:border-ink group-hover/card:bg-ink group-hover/card:text-white"
                >
                  <ArrowUpRight size={19} />
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
