import Link from 'next/link'
import type {ReactNode} from 'react'

export function Container({children, className = ''}: {children: ReactNode; className?: string}) {
  return <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 ${className}`}>{children}</div>
}

type Variant = 'primary' | 'dark' | 'outline' | 'outline-light'

const variants: Record<Variant, string> = {
  primary: 'bg-solar text-ink hover:bg-[#f7b55c]',
  dark: 'bg-ink text-white hover:bg-steel',
  outline: 'border border-ink/25 text-ink hover:border-ink hover:bg-white',
  'outline-light': 'border border-white/35 text-white hover:border-white hover:bg-white/10',
}

export function ButtonLink({
  href, children, variant = 'primary', external, className = '',
}: {href: string; children: ReactNode; variant?: Variant; external?: boolean; className?: string}) {
  const cls = `inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 py-2.5 text-[0.95rem] font-semibold transition-colors ${variants[variant]} ${className}`
  if (external || href.startsWith('tel:') || href.startsWith('mailto:')) {
    return (
      <a href={href} className={cls} {...(href.startsWith('http') ? {target: '_blank', rel: 'noopener noreferrer'} : {})}>
        {children}
      </a>
    )
  }
  return <Link href={href} className={cls}>{children}</Link>
}

export function Breadcrumb({items}: {items: {label: string; href?: string}[]}) {
  return (
    <nav aria-label="Fil d’Ariane" className="text-sm text-steel">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>/</span>}
            {it.href ? (
              <Link href={it.href} className="underline-offset-4 hover:underline">{it.label}</Link>
            ) : (
              <span aria-current="page" className="text-ink">{it.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function PageHeader({
  title, intro, breadcrumb, children,
}: {title: string; intro?: string; breadcrumb?: {label: string; href?: string}[]; children?: ReactNode}) {
  return (
    <header className="border-b border-ink/10 bg-white">
      <Container className="py-10 sm:py-14">
        {breadcrumb && <div className="mb-5"><Breadcrumb items={breadcrumb} /></div>}
        <h1 className="max-w-3xl text-4xl font-bold leading-[1.05] sm:text-5xl">{title}</h1>
        {intro && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-steel">{intro}</p>}
        {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
      </Container>
    </header>
  )
}

export function Section({
  title, intro, children, className = '', action,
}: {title?: string; intro?: string; children: ReactNode; className?: string; action?: ReactNode}) {
  return (
    <section className={`py-14 sm:py-20 ${className}`}>
      <Container>
        {(title || action) && (
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              {title && <h2 className="max-w-2xl text-3xl font-bold leading-tight sm:text-4xl">{title}</h2>}
              {intro && <p className="mt-3 max-w-2xl text-steel">{intro}</p>}
            </div>
            {action}
          </div>
        )}
        {children}
      </Container>
    </section>
  )
}

/** Cadre de viseur de caméra : le seul élément décoratif du site. */
export function Viewfinder({children, className = ''}: {children: ReactNode; className?: string}) {
  const corner = 'pointer-events-none absolute h-7 w-7 border-solar'
  return (
    <div className={`relative ${className}`}>
      {children}
      <span aria-hidden className={`${corner} left-3 top-3 border-l-2 border-t-2`} />
      <span aria-hidden className={`${corner} right-3 top-3 border-r-2 border-t-2`} />
      <span aria-hidden className={`${corner} bottom-3 left-3 border-b-2 border-l-2`} />
      <span aria-hidden className={`${corner} bottom-3 right-3 border-b-2 border-r-2`} />
      <span className="pointer-events-none absolute left-12 top-[1.15rem] flex items-center gap-2 rounded bg-ink/70 px-2 py-1 text-xs font-medium text-white">
        <span aria-hidden className="h-2 w-2 rounded-full bg-red-500 motion-safe:animate-pulse" />
        Bamako
      </span>
    </div>
  )
}
