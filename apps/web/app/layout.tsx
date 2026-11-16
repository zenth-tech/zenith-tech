import type { Metadata, Viewport } from "next";
import "./globals.css";
import {
  bricolage,
  instrument,
  notoSans,
  playfairDisplayHeading,
  poppins,
} from "./fonts";
import { getSettings } from "@/lib/data";
import { SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";
import QueryProviders from "./providers";
import { Analytics } from "@vercel/analytics/next";

export const viewport: Viewport = { themeColor: "#10243b" };

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const name = s?.nomEntreprise ?? "ZENITH TECH-SARL";
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${name} : Sécurité Électronique, Réseaux & Énergie Solaire à Bamako`,
      template: `%s | ${name}`,
    },
    description:
      s?.presentation ??
      "Vidéosurveillance, contrôle d'accès, énergie solaire, réseaux et cybersécurité à Bamako et partout au Mali.",
    openGraph: {
      type: "website",
      locale: "fr_ML",
      siteName: name,
      description: s?.presentation!,
      images: [
        {
          url:
            s?.logo?.asset?.url ??
            "https://cdn.sanity.io/images/uw4odwl8/production/95ae8f482886bbd50b87b1fece6af9b4511b468b-935x340.svg",
          width: 1200,
          height: 630,
          alt: "Logo et services Zenith Tech Bamako",
        },
      ],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fr"
      className={cn(
        bricolage.variable,
        instrument.variable,
        "font-sans",
        notoSans.variable,
        playfairDisplayHeading.variable,
        poppins.variable,
      )}
    >
      <head />
      <body>
        <QueryProviders>{children}</QueryProviders>
        <Analytics />
      </body>
    </html>
  );
}
