"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useQuoteStore, type QuoteItem } from "@/store/quote";
import { Button } from "./ui/button";

export function ProductSection({ items }: { items: QuoteItem[] }) {
  const setQty = useQuoteStore((s) => s.setQty);
  const remove = useQuoteStore((s) => s.remove);

  return (
    <ul className="mt-4 divide-y divide-ink/10 overflow-hidden rounded-lg border border-ink/10 bg-white">
      {items.map((item) => (
        <li key={item.sku} className="flex gap-4 p-4">
          <Link
            href={item.url}
            className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md border border-ink/10 bg-concrete"
          >
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-contain p-1"
                sizes="80px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs text-steel">
                Produit
              </div>
            )}
          </Link>

          <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="min-w-0">
              <Link
                href={item.url}
                className="line-clamp-2 font-semibold leading-snug text-ink underline-offset-4 hover:underline"
              >
                {item.name}
              </Link>
              <p className="mt-0.5 text-sm text-steel">Réf. {item.sku}</p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <div
                className="inline-flex items-center rounded-md border border-ink/15 bg-white"
                aria-label={`Quantité pour ${item.name}`}
              >
                <Button
                  type="button"
                  onClick={() =>
                    item.qty > 1
                      ? setQty(item.sku, item.qty - 1)
                      : remove(item.sku)
                  }
                  variant="ghost"
                  aria-label={
                    item.qty > 1
                      ? `Diminuer la quantité de ${item.name}`
                      : `Retirer ${item.name}`
                  }
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </Button>
                <span className="w-10 text-center text-sm font-semibold tabular-nums text-ink">
                  {item.qty}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setQty(item.sku, item.qty + 1)}
                  aria-label={`Augmenter la quantité de ${item.name}`}
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>

              <Button
                type="button"
                variant="destructive"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md"
                onClick={() => remove(item.sku)}
                aria-label={`Retirer ${item.name} de la demande`}
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
