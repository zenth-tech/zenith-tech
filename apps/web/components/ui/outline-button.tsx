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

export function OutlineButton({
  href,
  children,
  className = "inline-flex",
  size = "md",
}: Props) {
  const root = useRef<HTMLAnchorElement>(null);
  const borderRotator = useRef<HTMLSpanElement>(null);
  const arrow = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Rotation très lente de la bordure (subtile)
        if (borderRotator.current) {
          gsap.to(borderRotator.current, {
            rotation: 360,
            duration: 8,
            ease: "none",
            repeat: -1,
            transformOrigin: "50% 50%",
          });
        }
      });

      return () => mm.revert();
    },
    { scope: root },
  );

  const handleEnter = () => {
    if (!root.current) return;
    gsap.to(root.current, { scale: 1.02, duration: 0.3, ease: "power2.out" });
    if (arrow.current) {
      gsap.to(arrow.current, { x: 3, duration: 0.3, ease: "power2.out" });
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
      className={`${className} group relative isolate items-center justify-center gap-2.5 overflow-hidden rounded-full font-semibold tracking-wide text-white ${sizing}`}
    >
      {/* ===== BORDURE CONIC ROTATIVE (fine, lente, subtile) ===== */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
      >
        <span
          ref={borderRotator}
          className="absolute -inset-[150%]"
          style={{
            backgroundImage:
              "conic-gradient(from 0deg, transparent 0deg 300deg, #facc15 330deg, #a3e635 360deg)",
          }}
        />
      </span>

      {/* ===== FOND INTÉRIEUR TRANSPARENT (outline) ===== */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[1.5px] rounded-full transition-colors duration-300"
        style={{
          background: "rgba(15, 23, 42, 0.85)",
          backdropFilter: "blur(6px)",
        }}
      />

      {/* ===== HOVER : léger glow interne ===== */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[1.5px] rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          boxShadow:
            "inset 0 0 20px rgba(250, 204, 21, 0.15), 0 0 20px rgba(163, 230, 53, 0.1)",
        }}
      />

      {/* ===== CONTENU (texte + flèche) ===== */}
      <span className="relative z-10 inline-flex items-center gap-2.5 text-white/90 transition-colors duration-300 group-hover:text-white">
        {children}
        <svg
          ref={arrow}
          className="h-4 w-4 shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
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
