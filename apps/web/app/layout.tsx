import type { Metadata, Viewport } from "next";
import "./globals.css";
import {
  bricolage,
  instrument,
  notoSans,
  playfairDisplayHeading,
} from "./fonts";
import { getSettings } from "@/lib/data";
import { SITE_URL } from "@/lib/site";
import { cn } from "@/lib/utils";
import QueryProviders from "./providers";

export const viewport: Viewport = { themeColor: "#10243b" };

export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const name = s?.nomEntreprise ?? "ZENITH TECH-SARL";
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${name} : sécurité électronique, solaire et IT à Bamako`,
      template: `%s | ${name}`,
    },
    description:
      s?.presentation ??
      "Vidéosurveillance, contrôle d'accès, énergie solaire, réseaux et cybersécurité à Bamako et partout au Mali.",
    openGraph: { type: "website", locale: "fr_ML", siteName: name },
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
      )}
    >
      <head />
      <body>
        <QueryProviders>{children}</QueryProviders>
      </body>
    </html>
  );
}
