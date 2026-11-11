"use client";

import { useEffect, useState } from "react";
import { useQuote } from "@/lib/quote";
import { useQuoteStore } from "@/store/quote";
import { Button } from "./ui/button";

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
  const { add: addQuote, ready, items } = useQuoteStore();
  const [done, setDone] = useState(false);

  console.log("Items in quote store:", items);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1800);
    return () => clearTimeout(t);
  }, [done]);

  return (
    <Button
      type="button"
      onClick={() => {
        addQuote({ sku, name, url });
        setDone(true);
      }}
      className={`inline-flex cursor-pointer min-h-10 rounded-md font-semibold text-white transition-colors hover:bg-steel ${size === "sm" ? "text-sm" : "text-[0.95rem]"} ${className}`}
    >
      <span aria-live="polite">
        {done ? "Ajouté à votre demande" : "Ajouter au devis"}
      </span>
    </Button>
  );
}
