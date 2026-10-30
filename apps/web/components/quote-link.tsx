'use client'

import Link from 'next/link'
import {useQuote} from '@/lib/quote'

export function QuoteCount({className = ''}: {className?: string}) {
  const {count, ready} = useQuote()
  if (!ready || count === 0) return null
  return (
    <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1.5 text-xs font-bold text-white ${className}`}>
      {count}
    </span>
  )
}

export function QuoteLink({className = 'inline-flex'}: {className?: string}) {
  return (
    <Link
      href="/devis"
      className={`${className} min-h-10 items-center gap-2 rounded-md bg-solar px-4 py-2 text-sm font-semibold text-ink transition-colors hover:bg-[#f7b55c]`}
    >
      Demander un devis
      <QuoteCount />
    </Link>
  )
}
