import type { Metadata } from "next";
import Link from "next/link";
import { getMetiers, getSettings } from "@/lib/data";
import { Container, PageHeader } from "@/components/ui";
import { CtaBand } from "@/components/cta-band";

export const metadata: Metadata = {
  title: "Nos services",
  description:
    "Sécurité électronique, énergie solaire, réseaux, cybersécurité et systèmes d’information : tous nos domaines d’intervention.",
  openGraph: {
    title: "Nos services",
    description:
      "Sécurité électronique, énergie solaire, réseaux, cybersécurité et systèmes d’information : tous nos domaines d’intervention.",
    url: "https://zenith-tech.com/services",
    siteName: "Zenith-Tech",
    images: [
      {
        url: "https://zenith-tech.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nos services",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
};

export default async function ServicesPage() {
  const [metiers, settings] = await Promise.all([getMetiers(), getSettings()]);
  return (
    <>
      <PageHeader
        title="Nos services"
        intro="Six domaines d’intervention pour sécuriser, alimenter et connecter vos bâtiments."
        breadcrumb={[{ label: "Accueil", href: "/" }, { label: "Services" }]}
      />
      <Container className="py-12">
        <ul className="divide-y divide-ink/10 border-y border-ink/10">
          {metiers.map((m) => (
            <li
              key={m.slug}
              className="relative grid gap-2 py-7 sm:grid-cols-[1fr_1.4fr] sm:gap-10"
            >
              <h2 className="text-2xl font-bold">
                <Link
                  href={`/services/${m.slug}`}
                  className="after:absolute after:inset-0 hover:underline underline-offset-4"
                >
                  {m.title}
                </Link>
              </h2>
              <p className="text-steel">{m.accroche}</p>
            </li>
          ))}
        </ul>
      </Container>
      <CtaBand settings={settings} />
    </>
  );
}
