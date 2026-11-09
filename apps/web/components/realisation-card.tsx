import Link from "next/link";
import type { RealisationCard as R } from "@/lib/types";
import { SanityImage } from "./sanity-image";

export function RealisationCard({ item: r }: { item: R }) {
  return (
    <article className="group relative">
      <SanityImage
        image={r.image}
        fallbackAlt={r.title}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="rounded-lg"
      />
      <h3 className="mt-3 text-lg font-bold leading-snug">
        <Link
          href={`/realisations/${r.slug}`}
          className="after:absolute after:inset-0 group-hover:underline underline-offset-4"
        >
          {r.title}
        </Link>
      </h3>
      {r.resume && (
        <p className="mt-1 text-sm leading-relaxed text-steel">{r.resume}</p>
      )}
      {r.ville && <p className="mt-1 text-sm font-semibold">{r.ville}</p>}
    </article>
  );
}
