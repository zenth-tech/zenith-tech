'use client'

import {useQuote} from '@/lib/quote'
import {BorderButton} from './border-button'

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
    <BorderButton href="/devis" size="sm" className={className}>
      Demander un devis
      <QuoteCount />
    </BorderButton>
  )
}
