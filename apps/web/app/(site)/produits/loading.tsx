import { CategoryCatalogSkeleton } from "@/components/category-catalog-skeleton";
import { Container } from "@/components/ui";

function MetierSectionSkeleton({ count = 4 }: { count?: number }) {
  return (
    <section className="animate-pulse">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink/15 pb-3">
        <div className="h-8 w-48 rounded bg-ink/10" />
        <div className="h-4 w-64 max-w-full rounded bg-ink/5" />
      </div>
      <div className="mt-5">
        <CategoryCatalogSkeleton variant="overlay" count={count} />
      </div>
    </section>
  );
}

export default function Loading() {
  return (
    <>
      {/* Skeleton du PageHeader (catalogue) */}
      <header className="border-b border-ink/10 bg-white">
        <Container className="py-10 sm:py-14">
          <div className="animate-pulse space-y-5">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2">
              <div className="h-3 w-16 rounded bg-ink/10" />
              <div className="h-3 w-3 rounded bg-ink/10" />
              <div className="h-3 w-20 rounded bg-ink/10" />
            </div>
            {/* Titre */}
            <div className="h-10 w-2/3 max-w-xl rounded bg-ink/10 sm:h-12" />
            {/* Intro */}
            <div className="space-y-2">
              <div className="h-4 w-full max-w-2xl rounded bg-ink/5" />
              <div className="h-4 w-4/5 max-w-xl rounded bg-ink/5" />
            </div>
          </div>
        </Container>
      </header>

      {/* Skeletons des sections par métier */}
      <Container className="space-y-14 py-12">
        <MetierSectionSkeleton count={4} />
        <MetierSectionSkeleton count={4} />
        <MetierSectionSkeleton count={3} />
      </Container>
    </>
  );
}
