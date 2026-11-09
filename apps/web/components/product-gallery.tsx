"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SanityImage } from "@/components/sanity-image";
import type { Img } from "@/lib/types";

gsap.registerPlugin(useGSAP);

type Props = {
  images: Img[];
  fallbackImage?: Img;
  productName: string;
};

export function ProductGallery({ images, fallbackImage, productName }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const mainImage = useRef<HTMLDivElement>(null);
  const hasMounted = useRef(false);
  const { contextSafe } = useGSAP({ scope: root });

  useGSAP(
    () => {
      if (!hasMounted.current) {
        hasMounted.current = true;
        return;
      }

      if (
        !mainImage.current ||
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

      gsap.fromTo(
        mainImage.current,
        { autoAlpha: 0, scale: 0.99 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.85,
          ease: "power2.out",
          overwrite: "auto",
        },
      );
    },
    { scope: root, dependencies: [activeIndex], revertOnUpdate: true },
  );

  const selectImage = contextSafe((index: number) => {
    if (index === activeIndex) return;

    if (
      !mainImage.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setActiveIndex(index);
      return;
    }

    gsap.to(mainImage.current, {
      autoAlpha: 0,
      duration: 0.35,
      ease: "power1.out",
      overwrite: "auto",
      onComplete: () => setActiveIndex(index),
    });
  });

  const showPrevious = () =>
    selectImage((activeIndex - 1 + images.length) % images.length);
  const showNext = () => selectImage((activeIndex + 1) % images.length);
  const activeImage = images[activeIndex] ?? fallbackImage;

  return (
    <div ref={root} className="space-y-3">
      <div ref={mainImage} className="group/image relative">
        <SanityImage
          image={activeImage}
          priority
          ratio="aspect-[4/3]"
          className="rounded-lg"
          sizes="(min-width: 1024px) 50vw, 100vw"
          fallbackAlt={productName}
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPrevious}
              aria-label="Image précédente"
              className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-white/85 text-ink shadow-md backdrop-blur transition hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Image suivante"
              className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-white/85 text-ink shadow-md backdrop-blur transition hover:scale-105 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
          {images.map((image, index) => (
            <button
              key={image?.asset?._id ?? index}
              type="button"
              aria-label={`Afficher l’image ${index + 1} de ${productName}`}
              aria-pressed={activeIndex === index}
              onClick={() => selectImage(index)}
              className={`overflow-hidden rounded-md border-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink ${
                activeIndex === index
                  ? "border-ink"
                  : "border-transparent hover:cursor-pointer hover:border-ink/50"
              }`}
            >
              <SanityImage
                image={image}
                ratio="aspect-square"
                className="h-full"
                sizes="(min-width: 640px) 15vw, 25vw"
                fallbackAlt={`${productName} — image ${index + 1}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
