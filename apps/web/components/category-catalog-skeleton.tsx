import { cn } from "@/lib/utils";

type Props = {
  variant?: "standard" | "overlay";
  count?: number;
  className?: string;
};

/**
 * Skeleton du composant <CategoryCatalog />.
 * Reproduit la même grille et les mêmes proportions pour éviter
 * tout layout shift quand les vraies données arrivent.
 */
export function CategoryCatalogSkeleton({
  variant = "standard",
  count = 6,
  className,
}: Props) {
  const isOverlay = variant === "overlay";

  return (
    <ul
      aria-busy="true"
      aria-live="polite"
      aria-label="Chargement du catalogue"
      className={cn(
        isOverlay
          ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          : "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <li key={i}>
          {isOverlay ? (
            /* ---------- Variant overlay ---------- */
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-ink/20">
              {/* Fond pulsant */}
              <div className="absolute inset-0 animate-pulse bg-ink/30" />
              {/* Dégradé bas (mime le from-ink via-ink/35) */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
              {/* Badge CATÉGORIE */}
              <div className="absolute left-4 top-4 h-6 w-24 animate-pulse rounded-full bg-white/20" />
              {/* Bloc bas : titre + description + flèche */}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-white/30" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-white/15" />
                </div>
                <div className="size-10 shrink-0 animate-pulse rounded-full bg-white/20" />
              </div>
            </div>
          ) : (
            /* ---------- Variant standard ---------- */
            <div className="overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm">
              <div className="relative aspect-[4/3] animate-pulse bg-mist">
                {/* Badge "Catégorie" */}
                <div className="absolute left-4 top-4 h-6 w-20 rounded-full bg-white/70" />
              </div>
              <div className="flex min-h-24 items-center justify-between gap-4 px-5 py-4">
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 animate-pulse rounded bg-ink/10" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-ink/5" />
                </div>
                <div className="size-10 shrink-0 animate-pulse rounded-full bg-ink/10" />
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
