import { QuoteItem } from "@/lib/quote";
import Link from "next/link";
import React from "react";
import { Input } from "./ui/input";
import { useQuoteStore } from "@/store/quote";

export function ProductSection({ items }: { items: QuoteItem[] }) {
  const { setQty, remove } = useQuoteStore();
  return (
    <ul className="mt-4 divide-y bg-amber-200 divide-ink/10 border-y border-ink/10">
      {items.map((i) => (
        <li
          key={i.sku}
          className="flex flex-wrap items-center justify-between gap-3 py-4"
        >
          <div className="min-w-0">
            <Link
              href={i.url}
              className="font-semibold underline-offset-4 hover:underline"
            >
              {i.name}
            </Link>
            <p className="text-sm text-steel">Réf. {i.sku}</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="sr-only" htmlFor={`qty-${i.sku}`}>
              Quantité pour {i.name}
            </label>
            <input
              id={`qty-${i.sku}`}
              type="number"
              min={1}
              max={999}
              inputMode="numeric"
              value={i.qty}
              onChange={(e) => setQty(i.sku, Number(e.target.value))}
              className="min-h-10"
            />
            <button
              type="button"
              onClick={() => remove(i.sku)}
              className="min-h-10 px-2 text-sm font-semibold text-steel underline underline-offset-4 hover:text-ink"
            >
              Retirer
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
