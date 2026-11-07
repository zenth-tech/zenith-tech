import type {Metadata} from 'next'
import {getSettings} from '@/lib/data'
import {digits} from '@/lib/site'
import {Container, PageHeader} from '@/components/ui'
import {QuoteForm} from '@/components/quote-form'

export const metadata: Metadata = {
  title: 'Demander un devis',
  description: 'Décrivez votre projet de vidéosurveillance, d’énergie solaire ou de sécurité : nous vous envoyons un devis détaillé.',
}

export default async function DevisPage({searchParams}: {searchParams: Promise<{sujet?: string | string[]}>}) {
  const [settings, sp] = await Promise.all([getSettings(), searchParams])
  const sujet = Array.isArray(sp.sujet) ? sp.sujet[0] : sp.sujet
  return (
    <>
      <PageHeader title="Demander un devis" intro="Indiquez vos produits et votre projet. Nous répondons par le canal que vous choisissez." breadcrumb={[{label: 'Accueil', href: '/'}, {label: 'Devis'}]} />
      <Container className="py-12">
        <QuoteForm defaultSubject={sujet?.slice(0, 120)} whatsapp={digits(settings.whatsapp?.[0]) || undefined} companyName={settings.nomEntreprise} />
      </Container>
    </>
  )
}
