import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface QuoteItem {
  sku: string;
  name: string;
  url: string;
  qty: number;
}

interface QuoteState {
  items: QuoteItem[];
  count: number;
  add: (item: Omit<QuoteItem, "qty">) => void;
  setQty: (sku: string, qty: number) => void;
  remove: (sku: string) => void;
  clear: () => void;
  ready: boolean;
  getCount: () => number;
}

export const useQuoteStore = create<QuoteState>()(
  persist(
    (set, get): QuoteState => ({
      items: [] as QuoteItem[],
      count: 0,
      ready: false,

      add: (quote) => {
        set((prev) => ({
          count: prev.count + 1,
          items: prev.items.some((i) => i.sku === quote.sku)
            ? prev.items.map((i) =>
                i.sku === quote.sku ? { ...i, qty: i.qty + 1 } : i,
              )
            : [...prev.items, { ...quote, qty: 1 }],
        }));
      },

      setQty: (sku, qty) => {
        set((prev) => {
          const item = prev.items.find((i) => i.sku === sku);
          if (!item) return prev;

          const nextQty = Math.max(1, Math.min(999, qty || 1));
          return {
            count: prev.count + nextQty - item.qty,
            items: prev.items.map((i) =>
              i.sku === sku ? { ...i, qty: nextQty } : i,
            ),
          };
        });
      },

      remove: (sku) => {
        set((prev) => {
          const item = prev.items.find((i) => i.sku === sku);
          if (!item) return prev;

          return {
            count: prev.count - item.qty,
            items: prev.items.filter((i) => i.sku !== sku),
          };
        });
      },

      clear: () => {
        set(() => ({ items: [], count: 0 }));
      },

      getCount: () => {
        return get().count;
      },
    }),
    {
      name: "quote-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
