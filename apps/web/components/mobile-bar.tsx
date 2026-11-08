import Link from "next/link";
import type { Settings } from "@/lib/types";
import { telHref, whatsappHref } from "@/lib/site";
import { QuoteCount } from "./quote-link";

/** Barre fixe sur téléphone : les trois canaux de contact toujours à portée de pouce. */
export function MobileBar({ settings }: { settings: Settings }) {
  const tel = telHref(settings);
  const wa = whatsappHref(settings, "Bonjour, je souhaite un renseignement.");
  const item =
    "flex min-h-14 flex-1 items-center justify-center gap-1 text-sm font-semibold";
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex border-t border-ink/15 bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
      {tel && (
        <a href={tel} className={item}>
          Appeler
        </a>
      )}
      {wa && (
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className={`${item} text-signal`}
        >
          WhatsApp
        </a>
      )}
      <Link href="/devis" className={`${item} bg-solar text-ink`}>
        Devis <QuoteCount />
      </Link>
    </div>
  );
}
