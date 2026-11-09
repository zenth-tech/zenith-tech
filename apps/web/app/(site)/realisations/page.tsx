import type { Metadata } from "next";
import { getRealisations, getSettings } from "@/lib/data";
import { Container, PageHeader } from "@/components/ui";
import { RealisationCard } from "@/components/realisation-card";
import { CtaBand } from "@/components/cta-band";
import { RealisationCard as R } from "@/lib/types";

export const metadata: Metadata = {
  title: "Nos réalisations",
  description:
    "Chantiers de vidéosurveillance, d'énergie solaire, réseau informatique et de sécurité réalisés à Bamako et au Mali.",
};

export default async function RealisationsPage() {
  const [items, settings] = await Promise.all([
    getRealisations(),
    getSettings(),
  ]);
  return (
    <>
      <PageHeader
        title="Nos réalisations"
        intro="Des chantiers livrés pour des particuliers, des écoles, des usines et des entreprises."
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Réalisations" },
        ]}
      />
      <Container className="py-12">
        {items.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((r) => (
              <RealisationCard key={r._id} item={r as R} />
            ))}
          </div>
        ) : (
          <p className="text-steel">
            Nos réalisations seront bientôt publiées ici.
          </p>
        )}
      </Container>
      <CtaBand settings={settings} />
    </>
  );
}
