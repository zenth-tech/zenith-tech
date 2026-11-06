import type {Settings} from '@/lib/types'
import {telHref, whatsappHref} from '@/lib/site'
import {ButtonLink, Container} from './ui'
import {BorderButton} from './border-button'

export function CtaBand({settings, title = 'Parlons de votre projet', text, subject}: {
  settings: Settings; title?: string; text?: string; subject?: string
}) {
  const wa = whatsappHref(settings, subject ? `Bonjour, je souhaite un devis pour : ${subject}.` : 'Bonjour, je souhaite un devis.')
  const tel = telHref(settings)
  return (
    <section className="bg-ink text-white">
      <Container className="flex flex-wrap items-center justify-between gap-6 py-12 sm:py-16">
        <div className="max-w-xl">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl">{title}</h2>
          <p className="mt-3 text-white/75">
            {text ?? 'Décrivez votre besoin : nous vous répondons avec un devis détaillé, par WhatsApp, téléphone ou email selon votre préférence.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <BorderButton href={subject ? `/devis?sujet=${encodeURIComponent(subject)}` : '/devis'}>Demander un devis</BorderButton>
          {wa && <ButtonLink href={wa} variant="outline-light" external>WhatsApp</ButtonLink>}
          {tel && <ButtonLink href={tel} variant="outline-light">Appeler</ButtonLink>}
        </div>
      </Container>
    </section>
  )
}
