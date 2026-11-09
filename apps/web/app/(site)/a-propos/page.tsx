import type { Metadata } from "next";
import Link from "next/link";
import { getClients, getMetiers, getSettings } from "@/lib/data";
import { Container, PageHeader, Section } from "@/components/ui";
import { SanityImage } from "@/components/sanity-image";
import { RichText } from "@/components/rich-text";
import { CtaBand } from "@/components/cta-band";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "ZENITH TECH-SARL : plus de cinq ans d’expérience en sécurité électronique, énergie solaire, réseaux et systèmes d’information à Bamako.",
};

export default async function AboutPage() {
  const [s, metiers, clients] = await Promise.all([
    getSettings(),
    getMetiers(),
    getClients(),
  ]);
  return (
    <>
      <PageHeader
        title={
          s?.aProposTitre ??
          "Une référence de la sécurité des bâtiments à Bamako"
        }
        intro={s?.presentation ?? undefined}
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "À propos" }]}
      />

      <Container className="grid items-start gap-10 py-14 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          {s?.aProposTexte?.length ? (
            <RichText value={s?.aProposTexte} className="text-lg" />
          ) : (
            <p className="max-w-2xl text-lg leading-relaxed text-steel">
              Depuis plus de cinq ans, notre société est reconnue pour son
              savoir-faire, sa disponibilité, la qualité de ses produits, la
              sécurité et la ponctualité dans l’exécution de ses chantiers.
            </p>
          )}
          {s?.chiffresCles && s?.chiffresCles.length > 0 && (
            <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
              {s?.chiffresCles.map((c) => (
                <div key={c.libelle}>
                  <dt className="text-steel">{c.libelle}</dt>
                  <dd className="font-display text-5xl font-bold">
                    {c.valeur}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>
        <SanityImage
          image={s?.aProposImage}
          ratio="aspect-[4/5]"
          className="rounded-lg"
          fallbackAlt="L’équipe sur un chantier"
        />
      </Container>

      {s?.valeurs && s?.valeurs.length > 0 && (
        <Section title="Notre façon de travailler" className="bg-white">
          <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {s.valeurs.map((v) => (
              <div key={v.titre} className="border-t border-ink/15 pt-4">
                <dt className="font-display text-xl font-bold">{v.titre}</dt>
                {v.description && (
                  <dd className="mt-1 text-steel">{v.description}</dd>
                )}
              </div>
            ))}
          </dl>
        </Section>
      )}

      <Section title="Nos domaines d’intervention">
        <ul className="grid gap-x-10 sm:grid-cols-2">
          {metiers.map((m) => (
            <li key={m.slug} className="relative border-t border-ink/15 py-4">
              <Link
                href={`/services/${m.slug}`}
                className="font-display text-lg font-bold after:absolute after:inset-0 hover:underline underline-offset-4"
              >
                {m.title}
              </Link>
              {m.accroche && <p className="mt-1 text-steel">{m.accroche}</p>}
            </li>
          ))}
        </ul>
      </Section>

      {clients.length > 0 && (
        <Section title="Ils nous font confiance" className="bg-white">
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-ink/10 bg-ink/10 sm:grid-cols-3 lg:grid-cols-4">
            {clients.map((c) => (
              <li
                key={c._id}
                className="grid min-h-24 place-items-center bg-white p-4 text-center"
              >
                {c.logo?.asset ? (
                  <div className="w-28">
                    <SanityImage
                      image={c.logo}
                      ratio="aspect-[3/2]"
                      sizes="112px"
                      fallbackAlt={c.nom}
                    />
                  </div>
                ) : (
                  <div>
                    <span className="font-display font-bold">{c.nom}</span>
                    {c.secteur && (
                      <span className="block text-sm text-steel">
                        {c.secteur}
                      </span>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CtaBand settings={s} title="Travaillons ensemble" />
    </>
  );
}
