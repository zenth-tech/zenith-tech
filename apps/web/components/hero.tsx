"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ButtonLink, Container, Viewfinder } from "./ui";
import { BorderButton } from "./border-button";
import { QuoteButton } from "./ui/quote-button";
import { OutlineButton } from "./ui/outline-button";

gsap.registerPlugin(useGSAP);

type Props = {
  title: string;
  text: string;
  image: ReactNode;
  whatsappHref?: string;
  telHref?: string;
  phoneLabel?: string;
};

/**
 * Accueil : le texte est rendu côté serveur (visible par Google et sans JavaScript).
 * L'animation d'ouverture est jouée par GSAP après le chargement :
 *  1. les mots du titre montent un par un (masque), 2. le texte et les boutons apparaissent,
 *  3. le cadre de viseur « se verrouille » autour de la photo.
 * Les états de départ sont dans globals.css (uniquement si JavaScript actif et animations autorisées),
 * avec une sécurité qui affiche tout au bout de 3 s si le script ne démarre pas.
 */
export function Hero({
  title,
  text,
  image,
  whatsappHref,
  telHref,
  phoneLabel,
}: Props) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo(
          "[data-hero-word]",
          { yPercent: 105, opacity: 1 },
          { yPercent: 0, duration: 0.95, stagger: 0.07, ease: "power4.out" },
        )
          .fromTo(
            "[data-hero-fade]",
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 },
            "-=0.55",
          )
          .fromTo(
            "[data-hero-image]",
            { opacity: 0, scale: 1.06 },
            { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" },
            0.25,
          )
          .fromTo(
            "[data-vf-corner]",
            { opacity: 0, scale: 2.2 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.55,
              stagger: 0.08,
              ease: "back.out(1.8)",
            },
            0.9,
          )
          .fromTo(
            "[data-vf-label]",
            { opacity: 0, x: -8 },
            { opacity: 1, x: 0, duration: 0.5 },
            1.45,
          );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const words = title.split(" ");

  return (
    <section ref={root} data-hero className="bg-ink text-white">
      <Container className="grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h1 className="text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-[3.4rem]">
            {words.map((w, i) => (
              <span key={i}>
                {/* Le masque coupe le mot qui monte ; le padding évite de rogner les jambages (g, p, q) */}
                <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
                  <span
                    data-hero-word
                    className="inline-block will-change-transform"
                  >
                    {w}
                  </span>
                </span>
                {i < words.length - 1 && " "}
              </span>
            ))}
          </h1>
          <p
            data-hero-fade
            className="mt-5 font-poppins max-w-xl text-lg leading-relaxed text-white/80"
          >
            {text}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <div data-hero-fade>
              <QuoteButton href="/devis">Demander un devis</QuoteButton>
            </div>
            <div data-hero-fade>
              <OutlineButton href="/produits">
                Parcourir le catalogue
              </OutlineButton>
            </div>
          </div>
          {(whatsappHref || telHref) && (
            <p data-hero-fade className="mt-6 text-sm text-white/70">
              Une question ? Écrivez-nous sur{" "}
              {whatsappHref && (
                <a
                  className="font-semibold text-white underline underline-offset-4"
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              )}
              {whatsappHref && telHref && " ou appelez le "}
              {telHref && (
                <a
                  className="font-semibold text-white underline underline-offset-4"
                  href={telHref}
                >
                  {phoneLabel}
                </a>
              )}
              .
            </p>
          )}
        </div>
        <Viewfinder className="mx-auto w-full max-w-[34rem] rounded-[1.75rem] border border-white/15 bg-white/[0.04] shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
          <div
            data-hero-image
            className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.2rem] bg-black"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            >
              <source src="/videos/hero.mp4" type="video/mp4" />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
          </div>
        </Viewfinder>
      </Container>
    </section>
  );
}
