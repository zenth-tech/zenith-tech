import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategorie, getCategorieProducts, getSettings } from "@/lib/data";
import { applyFilters, buildFacets } from "@/lib/facets";
import { seoMeta } from "@/lib/seo";
import { Container, PageHeader } from "@/components/ui";
import { Filters } from "@/components/filters";
import { CtaBand } from "@/components/cta-band";
import { ProductCard } from "@/components/product-card";

type Props = {
  params: Promise<{ metier: string; categorie: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { metier, categorie } = await params;
  const c = await getCategorie(metier, categorie);
  return c
    ? seoMeta(c.seo, `${c.title} : ${c.metier?.title}`, c?.description ?? "")
    : {};
}

export default async function CategoriePage({ params, searchParams }: Props) {
  const { metier, categorie } = await params;
  const sp = await searchParams;
  const [c, products, settings] = await Promise.all([
    getCategorie(metier, categorie),
    getCategorieProducts(metier, categorie),
    getSettings(),
  ]);
  if (!c) notFound();

  const selected: Record<string, string[]> = {};
  for (const [k, v] of Object.entries(sp)) {
    if (k.startsWith("f.") && v)
      selected[k.slice(2)] = Array.isArray(v) ? v : [v];
  }
  const facets = buildFacets(products, c.filtres ?? []);
  const shown = applyFilters(products, selected);
  const hasFilters = Object.values(selected).some((v) => v.length);

  return (
    <>
      <PageHeader
        title={c.title!}
        intro={c.description!}
        breadcrumb={[
          { label: "Accueil", href: "/" },
          { label: "Catalogue", href: "/produits" },
          { label: c.metier?.title!, href: `/produits/${c.metier?.slug}` },
          { label: c.title! },
        ]}
      />
      <Container className="grid gap-10 py-12 lg:grid-cols-[15rem_1fr]">
        {facets.length > 0 && (
          <>
            <details className="rounded-lg border border-ink/10 bg-white p-4 lg:hidden">
              <summary className="cursor-pointer font-semibold">
                Filtrer les produits
              </summary>
              <div className="mt-4">
                <Filters facets={facets} selected={selected} />
              </div>
            </details>
            <aside className="hidden lg:block">
              <Filters facets={facets} selected={selected} />
            </aside>
          </>
        )}
        <div className={facets.length === 0 ? "lg:col-span-2" : ""}>
          <p className="mb-5 text-steel" aria-live="polite">
            {shown.length} produit{shown.length > 1 ? "s" : ""}
            {hasFilters && (
              <>
                {" "}
                ·{" "}
                <Link
                  href={`/produits/${metier}/${categorie}`}
                  className="font-semibold text-ink underline underline-offset-4"
                >
                  Retirer les filtres
                </Link>
              </>
            )}
          </p>
          {shown.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {shown.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-ink/25 p-8">
              <p className="font-semibold">
                {hasFilters
                  ? "Aucun produit ne correspond à ces filtres."
                  : "Les produits de cette catégorie arrivent bientôt."}
              </p>
              <p className="mt-1 text-steel">
                {hasFilters ? "Retirez un filtre ou " : "En attendant, "}
                décrivez-nous votre besoin : nous vous proposons le bon
                équipement.
              </p>
            </div>
          )}
        </div>
      </Container>
      <CtaBand settings={settings} subject={c.title!} />
    </>
  );
}
