import {ButtonLink, Container} from '@/components/ui'

export default function NotFound() {
  return (
    <Container className="py-24">
      <h1 className="text-4xl font-bold">Cette page n’existe pas</h1>
      <p className="mt-3 max-w-lg text-steel">Le lien est peut-être ancien ou mal écrit. Retournez à l’accueil ou parcourez le catalogue.</p>
      <div className="mt-6 flex gap-3">
        <ButtonLink href="/">Retour à l’accueil</ButtonLink>
        <ButtonLink href="/produits" variant="outline">Voir le catalogue</ButtonLink>
      </div>
    </Container>
  )
}
