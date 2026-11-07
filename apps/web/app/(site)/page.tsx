import {
  getClients,
  getFeaturedProducts,
  getFeaturedRealisations,
  getMetiers,
  getSettings,
} from "@/lib/data";
import { telHref, whatsappHref } from "@/lib/site";
import { ButtonLink, Section } from "@/components/ui";
import { Hero } from "@/components/hero";
import { SanityImage } from "@/components/sanity-image";
import { ActivityPoles } from "@/components/activity-poles";
import { ProductCard, RealisationCard } from "@/components/cards";
import { CtaBand } from "@/components/cta-band";
import { ScrollReveal } from "@/components/scroll-reveal";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import getQueryClient from "../getQueryClient";

export default async function HomePage() {
  const queryClient = getQueryClient();

  const [settings, metiers, products, realisations, clients] = await Promise.all([
    queryClient.query({
      queryKey: ["settings"],
      queryFn: getSettings,
    }),
    queryClient.query({
      queryKey: ["metiers"],
      queryFn: getMetiers,
    }),
    queryClient.query({
      queryKey: ["products"],
      queryFn: getFeaturedProducts,
    }),
    queryClient.query({
      queryKey: ["realisations"],
      queryFn: getFeaturedRealisations,
    }),
    queryClient.query({
      queryKey: ["clients"],
      queryFn: getClients,
    }),
  ]);

  const wa = whatsappHref(settings, "Bonjour, je souhaite un devis.");
  const tel = telHref(settings);
  const heroImage = realisations.find((r) => r.image?.asset)?.image ?? null;

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Hero
        title="Sécurité électronique, énergie solaire et infrastructures IT, installées à Bamako"
        text={
          settings.presentation ??
          "Nous concevons, installons et maintenons la sécurité et l’énergie de vos bâtiments depuis plus de cinq ans."
        }
        whatsappHref={wa}
        telHref={tel}
        phoneLabel={settings.telephone?.[0]}
        image={
          <SanityImage
            image={heroImage}
            ratio="aspect-[4/3]"
            priority
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="rounded-lg"
          />
        }
      />

      <ScrollReveal staggerSelector="[data-activity-card]">
        <ActivityPoles metiers={metiers} />
      </ScrollReveal>

      {products.length > 0 && (
        <ScrollReveal staggerSelector="[data-reveal-item]">
          <Section
            title="Produits que nous installons"
            intro="Ajoutez les produits qui vous intéressent à votre demande, nous vous envoyons un devis."
            className="bg-white"
            action={
              <ButtonLink href="/produits" variant="outline">
                Tout le catalogue
              </ButtonLink>
            }
          >
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {products.slice(0, 4).map((p) => (
                <div key={p._id} data-reveal-item>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </Section>
        </ScrollReveal>
      )}

      {realisations.length > 0 && (
        <ScrollReveal staggerSelector="[data-reveal-item]">
          <Section
            title="Nos dernières réalisations"
            action={
              <ButtonLink href="/realisations" variant="outline">
                Toutes les réalisations
              </ButtonLink>
            }
          >
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {realisations.slice(0, 3).map((r) => (
                <div key={r._id} data-reveal-item>
                  <RealisationCard item={r} />
                </div>
              ))}
            </div>
          </Section>
        </ScrollReveal>
      )}

      {clients.length > 0 && (
        <ScrollReveal staggerSelector="[data-reveal-item]">
          <Section title="Ils nous font confiance" className="bg-white">
            <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-ink/10 bg-ink/10 sm:grid-cols-4">
              {clients.slice(0, 8).map((c) => (
                <li
                  key={c._id}
                  data-reveal-item
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
                    <span className="font-display font-bold">{c.nom}</span>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        </ScrollReveal>
      )}

      <ScrollReveal>
        <CtaBand settings={settings} />
      </ScrollReveal>
    </HydrationBoundary>
  );
}
