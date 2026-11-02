import type { Metadata, Viewport } from "next";
import "./globals.css";
import { bricolage, instrument } from "./fonts";
import { QuoteProvider } from "@/lib/quote";
import { getSettings } from "@/lib/data";
import { SITE_URL, digits } from "@/lib/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { MobileBar } from "@/components/mobile-bar";
import { Noto_Sans, Playfair_Display } from "next/font/google";
import { cn } from "@/lib/utils";

const playfairDisplayHeading = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});

const notoSans = Noto_Sans({ subsets: ["latin"], variable: "--font-sans" });

export const viewport: Viewport = { themeColor: "#10243b" };

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const name = s.nomEntreprise ?? "ZENITH TECH-SARL";
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${name} : sécurité électronique, solaire et IT à Bamako`,
      template: `%s | ${name}`,
    },
    description:
      s.presentation ??
      "Vidéosurveillance, contrôle d’accès, énergie solaire, réseaux et cybersécurité à Bamako et partout au Mali.",
    openGraph: { type: "website", locale: "fr_ML", siteName: name },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const s = await getSettings();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: s.nomEntreprise ?? "ZENITH TECH-SARL",
    url: SITE_URL,
    telephone: s.telephone ? `+${digits(s.telephone[0])}` : undefined,
    email: s.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: s.adresse,
      addressLocality: s.ville ?? "Bamako",
      addressCountry: "ML",
    },
    areaServed: s.zoneCouverture ?? "Mali",
  };
  return (
    <html
      lang="fr"
      className={cn(
        bricolage.variable,
        instrument.variable,
        "font-sans",
        notoSans.variable,
        playfairDisplayHeading.variable,
      )}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <QuoteProvider>
          <a
            href="#contenu"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-solar focus:px-4 focus:py-2 focus:font-semibold"
          >
            Aller au contenu
          </a>
          <SiteHeader />
          <main id="contenu">{children}</main>
          <SiteFooter />
          <MobileBar settings={s} />
        </QuoteProvider>
      </body>
    </html>
  );
}
