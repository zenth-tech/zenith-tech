import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRealisation, getSettings } from "@/lib/data";
import { seoMeta } from "@/lib/seo";
import { Breadcrumb, Container, Section } from "@/components/ui";
import { SanityImage } from "@/components/sanity-image";
import { RichText } from "@/components/rich-text";
import { VideoEmbed } from "@/components/video-embed";
import { CtaBand } from "@/components/cta-band";
import { ProductCard } from "@/components/product-card";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const r = await getRealisation((await params).slug);
  return r ? seoMeta(r.seo, r.title!, r.resume!) : {};
}

export default async function RealisationPage({ params }: Props) {
  const slug = (await params).slug;
  const [r, settings] = await Promise.all([
    getRealisation(slug),
    getSettings(),
  ]);
  if (!r) notFound();
  console.log("realisations", r.seo);

  const images = (r.images ?? []).filter((i) => i?.asset);
  const blocks = [
    { title: "Le besoin du client", value: r.contexte },
    { title: "Notre solution", value: r.solution },
    { title: "Le résultat", value: r.resultat },
  ].filter((b) => b.value?.length);

  return (
    <>
      <Container className="py-8">
        <Breadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Réalisations", href: "/realisations" },
            { label: r.title! },
          ]}
        />
        <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.05] sm:text-5xl">
          {r.title}
        </h1>
        {r.resume && (
          <p className="mt-4 max-w-2xl text-lg text-steel">{r.resume}</p>
        )}
        <p className="mt-3 text-sm text-steel">
          {[
            r.client,
            r.ville,
            r.typeClient === "entreprise"
              ? "Entreprise"
              : r.typeClient === "particulier"
                ? "Particulier"
                : null,
          ]
            .filter(Boolean)
            .join(", ")}
        </p>
      </Container>

      <Container className="space-y-3 pb-12">
        <SanityImage
          image={images[0]}
          ratio="aspect-[16/8]"
          priority
          className="rounded-lg"
          sizes="100vw"
          fallbackAlt={r.title!}
        />
        {images.length > 1 && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {images.slice(1, 9).map((img, i) => (
              <SanityImage
                key={i}
                image={img}
                ratio="aspect-[4/3]"
                className="rounded-md"
                sizes="25vw"
                fallbackAlt={r.title!}
              />
            ))}
          </div>
        )}
      </Container>

      {blocks.length > 0 && (
        <Container className="grid gap-10 pb-14 md:grid-cols-3">
          {blocks.map((b) => (
            <div key={b.title}>
              <h2 className="mb-3 text-xl font-bold">{b.title}</h2>
              <RichText value={b.value} />
            </div>
          ))}
        </Container>
      )}

      {r.videoUrl && (
        <Container className="pb-14">
          <div className="max-w-3xl">
            <VideoEmbed url={r.videoUrl} title={`Vidéo : ${r.title}`} />
          </div>
        </Container>
      )}

      {r.produits && r.produits.length > 0 && (
        <Section title="Produits installés" className="bg-white">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {r.produits.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </Section>
      )}

      <CtaBand settings={settings} title="Un projet similaire ?" />
    </>
  );
}
