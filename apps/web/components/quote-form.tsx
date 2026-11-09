"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuote } from "@/lib/quote";

type Props = {
  defaultSubject?: string;
  whatsapp?: string;
  companyName?: string;
};
type Canal = "whatsapp" | "telephone" | "email";

const field =
  "mt-1.5 block min-h-11 w-full rounded-md border border-ink/25 bg-white px-3 py-2 focus:border-ink";
const label = "block text-sm font-semibold";

export function QuoteForm({ defaultSubject, whatsapp, companyName }: Props) {
  const { items, setQty, remove, clear, ready } = useQuote();
  const [canal, setCanal] = useState<Canal>("whatsapp");
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const [sent, setSent] = useState<{ name: string; qty: number }[]>([]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;
    if (items.length === 0 && !data.message?.trim()) {
      setError("Ajoutez un produit ou décrivez votre besoin dans le message.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          canal,
          items: items.map(({ sku, name, qty }) => ({ sku, name, qty })),
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Envoi impossible");
      setSent(items.map(({ name, qty }) => ({ name, qty })));
      clear();
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Envoi impossible");
      setStatus("error");
    }
  }

  if (status === "done") {
    const lines = sent.map((i) => `- ${i.qty} x ${i.name}`).join("\n");
    const msg = `Bonjour${companyName ? " " + companyName : ""}, je viens d’envoyer une demande de devis sur votre site.${lines ? "\n" + lines : ""}`;
    return (
      <div
        role="status"
        className="rounded-lg border border-signal/40 bg-white p-8"
      >
        <h2 className="text-2xl font-bold">Demande envoyée</h2>
        <p className="mt-2 max-w-xl text-steel">
          Nous revenons vers vous rapidement par{" "}
          {canal === "whatsapp"
            ? "WhatsApp"
            : canal === "telephone"
              ? "téléphone"
              : "email"}
          . Pour aller plus vite, vous pouvez aussi nous écrire directement.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {whatsapp && (
            <a
              className="inline-flex min-h-11 items-center rounded-md bg-signal px-5 font-semibold text-white"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`}
            >
              Écrire sur WhatsApp
            </a>
          )}
          <Link
            href="/produits"
            className="inline-flex min-h-11 items-center rounded-md border border-ink/25 px-5 font-semibold"
          >
            Continuer à parcourir le catalogue
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-10 lg:grid-cols-[1fr_1.1fr]"
      noValidate
    >
      <section aria-labelledby="produits-devis">
        <h2 id="produits-devis" className="text-2xl font-bold">
          Vos produits
        </h2>
        {!ready ? null : items.length === 0 ? (
          <div className="mt-4 rounded-lg border border-dashed border-ink/25 p-6">
            <p className="font-semibold">Aucun produit pour le moment.</p>
            <p className="mt-1 text-steel">
              <Link href="/produits" className="underline underline-offset-4">
                Parcourez le catalogue
              </Link>{" "}
              et ajoutez des produits, ou décrivez simplement votre projet dans
              le message.
            </p>
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-ink/10 border-y border-ink/10">
            {items.map((i) => (
              <li
                key={i.sku}
                className="flex flex-wrap items-center justify-between gap-3 py-4"
              >
                <div className="min-w-0">
                  <Link
                    href={i.url}
                    className="font-semibold underline-offset-4 hover:underline"
                  >
                    {i.name}
                  </Link>
                  <p className="text-sm text-steel">Réf. {i.sku}</p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="sr-only" htmlFor={`qty-${i.sku}`}>
                    Quantité pour {i.name}
                  </label>
                  <input
                    id={`qty-${i.sku}`}
                    type="number"
                    min={1}
                    max={999}
                    value={i.qty}
                    inputMode="numeric"
                    onChange={(e) => setQty(i.sku, Number(e.target.value))}
                    className="min-h-10 w-20 "
                  />
                  <button
                    type="button"
                    onClick={() => remove(i.sku)}
                    className="min-h-10 px-2 text-sm font-semibold text-steel underline underline-offset-4 hover:text-ink"
                  >
                    Retirer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="coordonnees" className="space-y-5">
        <h2 id="coordonnees" className="text-2xl font-bold">
          Vos coordonnées
        </h2>

        {/* Piège à robots : invisible pour les personnes */}
        <div aria-hidden className="absolute -left-[9999px]">
          <label>
            Ne pas remplir
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div>
          <label className={label} htmlFor="nom">
            Nom complet
          </label>
          <input
            id="nom"
            name="nom"
            required
            autoComplete="name"
            className={field}
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="telephone">
              Téléphone{canal !== "email" && " (obligatoire)"}
            </label>
            <input
              id="telephone"
              name="telephone"
              type="tel"
              autoComplete="tel"
              required={canal !== "email"}
              className={field}
            />
          </div>
          <div>
            <label className={label} htmlFor="email">
              Email{canal === "email" && " (obligatoire)"}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required={canal === "email"}
              className={field}
            />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label} htmlFor="ville">
              Ville
            </label>
            <input
              id="ville"
              name="ville"
              defaultValue="Bamako"
              autoComplete="address-level2"
              className={field}
            />
          </div>
          <div>
            <label className={label} htmlFor="typeClient">
              Vous êtes
            </label>
            <select
              id="typeClient"
              name="typeClient"
              className={field}
              defaultValue="particulier"
            >
              <option value="particulier">Un particulier</option>
              <option value="entreprise">
                Une entreprise ou une institution
              </option>
            </select>
          </div>
        </div>

        <fieldset>
          <legend className={label}>
            Comment souhaitez-vous être contacté ?
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {(
              [
                ["whatsapp", "WhatsApp"],
                ["telephone", "Appel téléphonique"],
                ["email", "Email"],
              ] as const
            ).map(([v, t]) => (
              <label
                key={v}
                className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border px-4 ${canal === v ? "border-ink bg-white font-semibold" : "border-ink/25"}`}
              >
                <input
                  type="radio"
                  name="canal"
                  value={v}
                  checked={canal === v}
                  onChange={() => setCanal(v)}
                  className="accent-[#10243b]"
                />
                {t}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className={label} htmlFor="message">
            Votre projet
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            defaultValue={
              defaultSubject
                ? `Je souhaite un devis pour : ${defaultSubject}.\n`
                : ""
            }
            placeholder="Type de bâtiment, nombre de points à équiper, délai souhaité…"
            className={`${field} min-h-32`}
          />
        </div>

        {status === "error" && (
          <p role="alert" className="font-semibold text-red-700">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex min-h-12 items-center justify-center rounded-md bg-solar px-7 font-semibold text-ink transition-colors hover:bg-[#f7b55c] disabled:opacity-60"
        >
          {status === "sending" ? "Envoi en cours" : "Envoyer ma demande"}
        </button>
        <p className="text-sm text-steel">
          Vos informations servent uniquement à répondre à votre demande.
        </p>
      </section>
    </form>
  );
}
