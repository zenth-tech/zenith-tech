import Link from "next/link";
import { getMenu, getSettings } from "@/lib/data";
import { Container } from "./ui";
import { MobileMenu } from "./mobile-menu";
import { QuoteLink } from "./quote-link";
import { SanityImage } from "./sanity-image";
import { HeaderNavigation } from "./header-navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export async function SiteHeader() {
  const queryClient = new QueryClient();
  const settings = await getSettings();

  await queryClient.query({
    queryKey: ["menu"],
    queryFn: getMenu,
  });

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-paper/95 shadow-[0_3px_16px_rgb(16_36_59/0.04)] backdrop-blur-xl">
      <Container className="flex h-[4.5rem] items-center justify-between gap-3 sm:gap-5">
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-2.5"
          aria-label={`${settings?.nomEntreprise ?? "Accueil"} : accueil`}
        >
          {settings?.logo?.asset ? (
            <div className="w-28 sm:w-32">
              <SanityImage
                image={settings.logo}
                ratio="aspect-[3/1]"
                sizes="128px"
              />
            </div>
          ) : (
            <>
              <span
                aria-hidden
                className="grid size-9 place-items-center rounded-lg bg-ink font-display text-lg font-bold text-solar"
              >
                Z
              </span>
              <span className="whitespace-nowrap font-display text-lg font-bold tracking-tight text-ink">
                Zenith Tech
              </span>
            </>
          )}
        </Link>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <HeaderNavigation />
        </HydrationBoundary>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <QuoteLink className="hidden sm:inline-flex" />
          <HydrationBoundary state={dehydrate(queryClient)}>
            <MobileMenu />
          </HydrationBoundary>
        </div>
      </Container>
    </header>
  );
}
