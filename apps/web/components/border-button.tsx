"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type Props = {
  href: string;
  children: ReactNode;
  /** Contrôle l'affichage (ex : "hidden sm:inline-flex"). */
  className?: string;
  size?: "sm" | "md";
};

export function BorderButton({
  href,
  children,
  className = "inline-flex",
  size = "md",
}: Props) {
  const root = useRef<HTMLAnchorElement>(null);
  const orbit = useRef<HTMLSpanElement>(null);
  const halo = useRef<HTMLSpanElement>(null);
  const shine = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      if (!orbit.current || !halo.current || !shine.current) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // 1. Rotation de la bordure conic (comme avant)
        gsap.to(orbit.current, {
          rotation: 360,
          duration: 3.2,
          ease: "none",
          repeat: -1,
        });

        // 2. Halo lumineux rotatif autour du bouton
        gsap.to(halo.current, {
          rotation: 360,
          duration: 4,
          ease: "none",
          repeat: -1,
          transformOrigin: "50% 50%",
        });

        // 3. Pulsation douce du halo
        gsap.to(halo.current, {
          scale: 1.15,
          opacity: 1,
          duration: 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        // 4. Shine qui traverse périodiquement
        gsap.fromTo(
          shine.current,
          { x: "-150%" },
          {
            x: "250%",
            duration: 2.4,
            repeat: -1,
            repeatDelay: 1.4,
            ease: "power2.inOut",
          },
        );

        // 5. Entrée animée
        gsap.from(root.current, {
          scale: 0.85,
          opacity: 0,
          duration: 0.7,
          ease: "back.out(1.7)",
        });
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  // Hover manuel avec GSAP (au lieu de group-hover sur le bg)
  const handleEnter = () => {
    if (!root.current) return;
    gsap.to(root.current, { scale: 1.04, duration: 0.3, ease: "power2.out" });
  };

  const handleLeave = () => {
    if (!root.current) return;
    gsap.to(root.current, { scale: 1, duration: 0.3, ease: "power2.out" });
  };

  const sizing =
    size === "sm"
      ? "min-h-10 px-4 py-2 text-sm"
      : "min-h-11 px-5 py-2.5 text-[0.95rem]";

  return (
    <Link
      ref={root}
      href={href}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`${className} group relative isolate items-center justify-center gap-2 overflow-hidden rounded-md font-semibold text-ink ${sizing}`}
    >
      {/* 1. Halo lumineux rotatif (jaune + vert) en arrière-plan */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-3 -z-10 rounded-md opacity-70 blur-[14px]"
      >
        <span
          ref={halo}
          className="absolute inset-0 rounded-md"
          style={{
            backgroundImage:
              "conic-gradient(from 0deg, #facc15 0deg, #a3e635 120deg, #ffffff 180deg, #a3e635 240deg, #facc15 360deg)",
          }}
        />
      </span>

      {/* 2. Bordure conic animée (comme dans ta version d'origine) */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      >
        <span
          ref={orbit}
          className="absolute -inset-[150%]"
          style={{
            backgroundImage:
              "conic-gradient(from 0deg, transparent 0deg 285deg, #facc15 305deg, #ffffff 325deg, #a3e635 345deg, transparent 360deg)",
          }}
        />
      </span>

      {/* 3. Fond intérieur (le vrai "bouton") */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[2px] rounded-[calc(0.375rem-2px)] bg-solar transition-colors group-hover:bg-[#f7b55c] group-focus-visible:bg-[#f7b55c]"
      />

      {/* 4. Shine qui traverse */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
      >
        <span
          ref={shine}
          className="absolute top-0 left-0 h-full w-[40%] -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent"
        />
      </span>

      {/* 5. Contenu */}
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </Link>
  );
}
