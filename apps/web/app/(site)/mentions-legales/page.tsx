import type {Metadata} from 'next'
import {getSettings} from '@/lib/data'
import {Container, PageHeader} from '@/components/ui'

export const metadata: Metadata = {title: 'Mentions légales', robots: {index: false}}

export default async function LegalPage() {
  const s = await getSettings()
  return (
    <>
      <PageHeader title="Mentions légales" breadcrumb={[{label: 'Accueil', href: '/'}, {label: 'Mentions légales'}]} />
      <Container className="max-w-3xl space-y-8 py-12 leading-relaxed text-steel">
        <section>
          <h2 className="mb-2 text-xl font-bold text-ink">Éditeur du site</h2>
          <p>{s.nomEntreprise}, société à responsabilité limitée.</p>
          {s.adresse && <p>Siège : {s.adresse}, {s.ville ?? 'Bamako'}, Mali.</p>}
          {s.rccm && <p>RCCM : {s.rccm}</p>}
          {s.nina && <p>NINA : {s.nina}</p>}
          {s.email && <p>Email : {s.email}</p>}
          {s.telephone && <p>Téléphone : {s.telephone.join(' / ')}</p>}
        </section>
        <section>
          <h2 className="mb-2 text-xl font-bold text-ink">Hébergement</h2>
          <p>À compléter avec le nom et l’adresse de l’hébergeur du site.</p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-bold text-ink">Données personnelles</h2>
          <p>
            Les informations saisies dans le formulaire de devis (nom, téléphone, email, ville, message) servent uniquement à répondre à votre demande.
            Elles ne sont pas revendues. Pour les consulter ou les supprimer, écrivez-nous à l’adresse ci-dessus.
          </p>
        </section>
        <section>
          <h2 className="mb-2 text-xl font-bold text-ink">Propriété intellectuelle</h2>
          <p>Les textes, photos et vidéos de réalisations sont la propriété de {s.nomEntreprise}. Les marques citées appartiennent à leurs détenteurs.</p>
        </section>
      </Container>
    </>
  )
}
