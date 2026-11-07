import type {Metadata} from 'next'
import {getSettings} from '@/lib/data'
import {mailHref, telHref, whatsappHref} from '@/lib/site'
import {ButtonLink, Container, PageHeader} from '@/components/ui'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contactez ZENITH TECH-SARL à Bamako par téléphone, WhatsApp ou email.',
}

export default async function ContactPage() {
  const s = await getSettings()
  const tel = telHref(s)
  const wa = whatsappHref(s, 'Bonjour, je souhaite un renseignement.')
  const mail = mailHref(s, 'Demande de renseignement')
  const maps = s.adresse ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${s.adresse}, ${s.ville ?? 'Bamako'}`)}` : undefined

  return (
    <>
      <PageHeader title="Contactez-nous" intro="Choisissez le canal qui vous convient : nous répondons sur tous." breadcrumb={[{label: 'Accueil', href: '/'}, {label: 'Contact'}]} />
      <Container className="grid gap-12 py-12 lg:grid-cols-2">
        <div className="space-y-4">
          {wa && (
            <div className="rounded-lg border border-ink/10 bg-white p-5">
              <h2 className="text-lg font-bold">WhatsApp</h2>
              <p className="mt-1 text-steel">Le plus rapide pour envoyer une photo ou un plan.</p>
              <ButtonLink href={wa} external className="mt-4 !bg-signal !text-white">Écrire sur WhatsApp</ButtonLink>
            </div>
          )}
          {tel && (
            <div className="rounded-lg border border-ink/10 bg-white p-5">
              <h2 className="text-lg font-bold">Téléphone</h2>
              <p className="mt-1 text-steel">{s.horaires}</p>
              <ButtonLink href={tel} variant="dark" className="mt-4">{s.telephone?.[0]}</ButtonLink>
            </div>
          )}
          {mail && (
            <div className="rounded-lg border border-ink/10 bg-white p-5">
              <h2 className="text-lg font-bold">Email</h2>
              <p className="mt-1 text-steel">Pour les appels d’offres et les dossiers détaillés.</p>
              <ButtonLink href={mail} variant="outline" className="mt-4">{s.email}</ButtonLink>
            </div>
          )}
        </div>
        <div>
          <h2 className="text-2xl font-bold">Où nous trouver</h2>
          {s.adresse && <p className="mt-3 text-lg">{s.adresse}</p>}
          {s.zoneCouverture && <p className="mt-1 text-steel">Zone d’intervention : {s.zoneCouverture}</p>}
          {maps && <ButtonLink href={maps} external variant="outline" className="mt-5">Ouvrir dans Google Maps</ButtonLink>}
          <p className="mt-8 text-steel">Pour un chiffrage précis, le plus efficace est de <a className="font-semibold text-ink underline underline-offset-4" href="/devis">remplir une demande de devis</a>.</p>
        </div>
      </Container>
    </>
  )
}
