import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getSettings } from "@/lib/data";
import { seoMeta } from "@/lib/seo";
import { SITE_URL, telHref, whatsappHref } from "@/lib/site";
import { Breadcrumb, ButtonLink, Container, Section } from "@/components/ui";
import { SanityImage } from "@/components/sanity-image";
import { RichText } from "@/components/rich-text";
import { VideoEmbed } from "@/components/video-embed";
import { AddToQuoteButton } from "@/components/add-to-quote";
import { ProductCard, productHref, RealisationCard } from "@/components/cards";

type Props = {
  params: Promise<{ metier: string; categorie: string; produit: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { metier, categorie, produit } = await params;
  const p = await getProduct(metier, categorie, produit);
  return p ? seoMeta(p.seo, p?.name!, p.accroche!) : {};
}

export default async function ProductPage({ params }: Props) {
  const { metier, categorie, produit } = await params;
  const [p, settings] = await Promise.all([
    getProduct(metier, categorie, produit),
    getSettings(),
  ]);
  if (!p) notFound();

  const images = (p.images ?? []).filter((i) => i?.asset);
  const specs = (p.caracteristiques ?? []).filter((c) => c.cle && c.valeur);
  const wa = whatsappHref(
    settings,
    `Bonjour, je souhaite commander ou avoir un prix pour : ${p.name} (${p.sku}).`,
  );
  const tel = telHref(settings);
  const hasLeft = Boolean(p.description?.length || p.videoUrl);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.sku,
    description: p.accroche,
    brand: p.marque ? { "@type": "Brand", name: p.marque } : undefined,
    url: `${SITE_URL}${productHref(p)}`,
    image: images.map((i) => i?.asset?.url),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container className="py-8">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Catalogue", href: "/produits" },
            {
              label: p.categorie.metier.title,
              href: `/produits/${p.categorie.metier.slug}`,
            },
            {
              label: p.categorie.title,
              href: `/produits/${p.categorie.metier.slug}/${p.categorie.slug}`,
            },
            { label: p.name! },
          ]}
        />
      </Container>

      <Container className="grid gap-10 pb-14 lg:grid-cols-2">
        <div className="space-y-3">
          <SanityImage
            image={images[0] ?? p.image}
            priority
            ratio="aspect-[4/3]"
            className="rounded-lg"
            sizes="(min-width: 1024px) 50vw, 100vw"
            fallbackAlt={p.name!}
          />
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.slice(1, 5).map((img, i) => (
                <SanityImage
                  key={i}
                  image={img}
                  ratio="aspect-square"
                  className="rounded-md"
                  sizes="15vw"
                  fallbackAlt={p.name!}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          {p.marque && <p className="text-steel">{p.marque}</p>}
          <h1 className="text-3xl font-bold leading-tight sm:text-4xl">
            {p.name}
          </h1>
          <p className="mt-1 text-sm text-steel">Référence {p.sku}</p>
          {p.accroche && (
            <p className="mt-4 text-lg leading-relaxed text-steel">
              {p.accroche}
            </p>
          )}
          {p.pointsForts && p.pointsForts.length > 0 && (
            <ul className="mt-5 list-disc space-y-1.5 pl-5">
              {p.pointsForts.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
          <div className="mt-7 flex flex-wrap gap-3">
            <AddToQuoteButton
              sku={p.sku!}
              name={p.name!}
              url={productHref(p)}
              className="px-6"
            />
            {wa && (
              <ButtonLink href={wa} variant="outline" external>
                Commander sur WhatsApp
              </ButtonLink>
            )}
            {tel && (
              <ButtonLink href={tel} variant="outline">
                Appeler
              </ButtonLink>
            )}
          </div>
          <p className="mt-3 text-sm text-steel">
            Les prix sont communiqués sur devis, selon la quantité et
            l’installation.
          </p>
        </div>
      </Container>

      {(p.description?.length || specs.length > 0 || p.videoUrl) && (
        <Section className="bg-white">
          <div className={`grid gap-12 ${hasLeft ? "lg:grid-cols-2" : ""}`}>
            <div className="space-y-8">
              {p.description?.length ? (
                <div>
                  <h2 className="mb-3 text-2xl font-bold">Description</h2>
                  <RichText value={p.description} />
                </div>
              ) : null}
              {p.videoUrl && (
                <VideoEmbed url={p.videoUrl} title={`Vidéo : ${p.name}`} />
              )}
            </div>
            {specs.length > 0 && (
              <div>
                <h2 className="mb-3 text-2xl font-bold">Caractéristiques</h2>
                <dl className="divide-y divide-ink/10 border-y border-ink/10">
                  {specs.map((c) => (
                    <div key={c.cle} className="grid grid-cols-2 gap-4 py-3">
                      <dt className="text-steel">{c.cle}</dt>
                      <dd className="font-semibold">{c.valeur}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-5 flex flex-wrap gap-4 text-sm font-semibold">
                  {p.ficheTechniqueUrl && (
                    <a
                      className="underline underline-offset-4"
                      href={p.ficheTechniqueUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Télécharger la fiche technique (PDF)
                    </a>
                  )}
                  {p.lienFabricant && (
                    <a
                      className="underline underline-offset-4"
                      href={p.lienFabricant}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Page du fabricant
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      {p.realisations && p.realisations.length > 0 && (
        <Section title="Installé chez nos clients">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {p.realisations.map((r) => (
              <RealisationCard key={r._id} item={r} />
            ))}
          </div>
        </Section>
      )}

      {p.similaires && p.similaires.length > 0 && (
        <Section title="Dans la même catégorie" className="bg-white">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {p.similaires.map((s) => (
              <ProductCard key={s._id} product={s} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
