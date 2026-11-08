"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export function ScrollReveal({
  children,
  revealItems = false,
}: {
  children: ReactNode;
  revealItems?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const element = root.current;
    if (!element) return;

    const items = Array.from(
      element.querySelectorAll<HTMLElement>("[data-scroll-reveal-item]"),
    );
    const targets = items.length > 0 ? items : [element];
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => entry.target);
        if (visible.length === 0) return;

        gsap.fromTo(
          visible,
          { y: 24, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.65,
            stagger: 0.12,
            ease: "power2.out",
            overwrite: true,
          },
        );
        visible.forEach((target) => observer.unobserve(target));
      },
      { threshold: 0.1 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => {
      observer.disconnect();
      gsap.killTweensOf(targets);
    };
  }, { scope: root });

  return (
    <div ref={root} data-scroll-reveal={!revealItems ? "true" : undefined}>
      {children}
    </div>
  );
}
