"use client";

import { useEffect, useState } from "react";
import { useQuote } from "@/lib/quote";

export function AddToQuoteButton({
  sku,
  name,
  url,
  size = "md",
  className = "",
}: {
  sku: string;
  name: string;
  url: string;
  size?: "sm" | "md";
  className?: string;
}) {
  const { add } = useQuote();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1800);
    return () => clearTimeout(t);
  }, [done]);

  return (
    <button
      type="button"
      onClick={() => {
        add({ sku, name, url });
        setDone(true);
      }}
      className={`inline-flex min-h-11 items-center justify-center rounded-md bg-ink px-4 font-semibold text-white transition-colors hover:bg-steel ${size === "sm" ? "text-sm" : "text-[0.95rem]"} ${className}`}
    >
      <span aria-live="polite">
        {done ? "Ajouté à votre demande" : "Ajouter au devis"}
      </span>
    </button>
  );
}
