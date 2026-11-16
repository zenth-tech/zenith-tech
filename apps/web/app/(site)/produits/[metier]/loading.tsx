import { CategoryCatalogSkeleton } from "@/components/category-catalog-skeleton";
import { Container } from "@/components/ui";

export default function Loading() {
  return (
    <>
      {/* ---------- Skeleton du PageHeader ---------- */}
      <section className="bg-vert-fonce text-white">
        <Container className="py-16">
          <div className="animate-pulse space-y-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2">
              <div className="h-3 w-16 rounded bg-white/20" />
              <div className="h-3 w-3 rounded bg-white/20" />
              <div className="h-3 w-20 rounded bg-white/20" />
              <div className="h-3 w-3 rounded bg-white/20" />
              <div className="h-3 w-24 rounded bg-white/20" />
            </div>
            {/* Titre */}
            <div className="h-12 w-2/3 max-w-md rounded bg-white/25 md:h-14" />
            {/* Intro */}
            <div className="space-y-2">
              <div className="h-4 w-full max-w-xl rounded bg-white/15" />
              <div className="h-4 w-4/5 max-w-lg rounded bg-white/15" />
            </div>
          </div>
        </Container>
      </section>

      {/* ---------- Skeleton du catalogue ---------- */}
      <Container className="py-12">
        <CategoryCatalogSkeleton variant="standard" count={6} />

        {/* Skeleton du lien "Présentation du service" */}
        <div className="mt-8 flex items-center gap-2 animate-pulse">
          <div className="h-4 w-40 rounded bg-ink/10" />
          <div className="h-4 w-28 rounded bg-ink/15" />
        </div>
      </Container>
    </>
  );
}
