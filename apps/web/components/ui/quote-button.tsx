"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  size?: "sm" | "md";
};

export function QuoteButton({
  href,
  children,
  className = "inline-flex",
  size = "md",
}: Props) {
  const root = useRef<HTMLAnchorElement>(null);
  const borderRotator = useRef<HTMLSpanElement>(null);
  const glowRotator = useRef<HTMLSpanElement>(null);
  const shine = useRef<HTMLSpanElement>(null);
  const arrow = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (borderRotator.current) {
          gsap.to(borderRotator.current, {
            rotation: 360,
            duration: 3,
            ease: "none",
            repeat: -1,
            transformOrigin: "50% 50%",
          });
        }

        if (glowRotator.current) {
          gsap.to(glowRotator.current, {
            rotation: 360,
            duration: 5,
            ease: "none",
            repeat: -1,
            transformOrigin: "50% 50%",
          });
        }

        if (shine.current) {
          gsap.fromTo(
            shine.current,
            { xPercent: -150 },
            {
              xPercent: 350,
              duration: 2.4,
              repeat: -1,
              repeatDelay: 1.2,
              ease: "power2.inOut",
            },
          );
        }
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const handleEnter = () => {
    if (!root.current) return;
    gsap.to(root.current, { scale: 1.04, duration: 0.3, ease: "power2.out" });
    if (arrow.current) {
      gsap.to(arrow.current, { x: 4, duration: 0.3, ease: "power2.out" });
    }
  };

  const handleLeave = () => {
    if (!root.current) return;
    gsap.to(root.current, { scale: 1, duration: 0.3, ease: "power2.out" });
    if (arrow.current) {
      gsap.to(arrow.current, { x: 0, duration: 0.3, ease: "power2.out" });
    }
  };

  const sizing =
    size === "sm"
      ? "min-h-10 px-5 py-2 text-sm"
      : "min-h-12 px-8 py-3 text-[1rem]";

  return (
    <Link
      ref={root}
      href={href}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={`${className} group relative isolate items-center justify-center gap-2.5 overflow-hidden rounded-full font-bold tracking-wide text-slate-900 ${sizing}`}
    >
      {/* ===== HALO LUMINEUX EXTÉRIEUR (jaune/vert, derrière tout) ===== */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 -z-20 rounded-full opacity-70 blur-2xl"
      >
        <span
          ref={glowRotator}
          className="absolute inset-0 rounded-full"
          style={{
            backgroundImage:
              "conic-gradient(from 0deg, #facc15 0deg, #a3e635 90deg, #ffffff 180deg, #a3e635 270deg, #facc15 360deg)",
          }}
        />
      </span>

      {/* ===== BORDURE CONIC ROTATIVE (fine, contrastée sur le jaune) ===== */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
      >
        <span
          ref={borderRotator}
          className="absolute -inset-[150%]"
          style={{
            backgroundImage:
              "conic-gradient(from 0deg, transparent 0deg 270deg, #ffffff 290deg, #a3e635 330deg, transparent 360deg)",
          }}
        />
      </span>

      {/* ===== FOND INTÉRIEUR JAUNE (le vrai bouton) ===== */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[2px] rounded-full transition-colors duration-300 group-hover:brightness-110"
        style={{
          background:
            "linear-gradient(135deg, #facc15 0%, #fde047 50%, #facc15 100%)",
        }}
      />

      {/* ===== SHINE QUI TRAVERSE ===== */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
      >
        <span
          ref={shine}
          className="absolute top-0 left-0 h-full w-[40%] -skew-x-12"
          style={{
            background:
              "linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)",
          }}
        />
      </span>

      {/* ===== CONTENU (texte + flèche) ===== */}
      <span className="relative z-10 inline-flex items-center gap-2.5 text-slate-900">
        {children}
        <svg
          ref={arrow}
          className="h-5 w-5 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}
