import { create } from "zustand";

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

export const useQuote = create<QuoteState>((set, get) => ({
  items: [],
  count: 0,
  ready: false,

  add: (quote) => {
    set((prev) => ({
      items: prev.items.some((i) => i.sku === quote.sku)
        ? prev.items.map((i) =>
            i.sku === quote.sku ? { ...i, qty: i.qty + 1 } : i,
          )
        : [...prev.items, { ...quote, qty: 1 }],
    }));
  },

  setQty: (sku, qty) => {
    set((prev) => ({
      items: prev.items.map((i) =>
        i.sku === sku ? { ...i, qty: Math.max(1, Math.min(999, qty || 1)) } : i,
      ),
    }));
  },

  remove: (sku) => {
    set((prev) => ({ items: prev.items.filter((item) => item.sku != sku) }));
  },

  clear: () => {
    set((prev) => ({ items: [] }));
  },

  getCount: () => {
    set((prev) => ({
      count: prev.items.reduce((n, i) => n + i.qty, 0),
    }));
    return get().count;
  },
}));
