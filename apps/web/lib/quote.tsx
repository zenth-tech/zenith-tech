'use client'

import {createContext, useCallback, useContext, useEffect, useMemo, useState} from 'react'

export type QuoteItem = {sku: string; name: string; url: string; qty: number}

type Ctx = {
  items: QuoteItem[]
  count: number
  add: (item: Omit<QuoteItem, 'qty'>) => void
  setQty: (sku: string, qty: number) => void
  remove: (sku: string) => void
  clear: () => void
  ready: boolean
}

const QuoteContext = createContext<Ctx | null>(null)
const KEY = 'zenith-devis'

export function QuoteProvider({children}: {children: React.ReactNode}) {
  const [items, setItems] = useState<QuoteItem[]>([])
  const [ready, setReady] = useState(false)

  // Chargement depuis le navigateur (le panier survit à un rechargement)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {}
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(KEY, JSON.stringify(items))
    } catch {}
  }, [items, ready])

  const add = useCallback((item: Omit<QuoteItem, 'qty'>) => {
    setItems((prev) =>
      prev.some((i) => i.sku === item.sku)
        ? prev.map((i) => (i.sku === item.sku ? {...i, qty: i.qty + 1} : i))
        : [...prev, {...item, qty: 1}],
    )
  }, [])
  const setQty = useCallback((sku: string, qty: number) => {
    setItems((prev) => prev.map((i) => (i.sku === sku ? {...i, qty: Math.max(1, Math.min(999, qty || 1))} : i)))
  }, [])
  const remove = useCallback((sku: string) => setItems((prev) => prev.filter((i) => i.sku !== sku)), [])
  const clear = useCallback(() => setItems([]), [])

  const value = useMemo(
    () => ({items, count: items.reduce((n, i) => n + i.qty, 0), add, setQty, remove, clear, ready}),
    [items, add, setQty, remove, clear, ready],
  )
  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>
}

export function useQuote() {
  const ctx = useContext(QuoteContext)
  if (!ctx) throw new Error('useQuote doit être utilisé dans <QuoteProvider>')
  return ctx
}
