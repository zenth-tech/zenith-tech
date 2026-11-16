import * as React from "react";
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

type QuoteEmailItem = {
  sku: string;
  name: string;
  qty: number;
};

export type QuoteEmailData = {
  nom: string;
  telephone: string;
  email: string;
  ville: string;
  typeClient: "particulier" | "entreprise";
  canal: string;
  message: string;
  items: QuoteEmailItem[];
  receivedAt: string;
};

const canalLabel: Record<string, string> = {
  whatsapp: "WhatsApp",
  telephone: "Téléphone",
  email: "Email",
};

const formatDate = (iso: string) => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(date);
};

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <Row className="mb-2">
      <Column className="w-[160px] align-top text-[13px] text-[#3e5873]">
        {label}
      </Column>
      <Column className="align-top text-[14px] font-semibold text-[#10243b]">
        {value?.trim() ? value : "Non renseigné"}
      </Column>
    </Row>
  );
}

export function QuoteRequestEmail({ quote }: { quote: QuoteEmailData }) {
  const received = formatDate(quote.receivedAt);

  return (
    <Html lang="fr">
      <Head />
      <Preview>Nouvelle demande de devis de {quote.nom}</Preview>
      <Tailwind>
        <Body className="m-0 bg-[#f7f8fa] py-6 font-sans">
          <Container className="mx-auto w-full max-w-[640px] overflow-hidden rounded-2xl border border-solid border-[#e6ebf0] bg-white">
            <Section className="bg-[#10243b] px-7 py-6">
              <Text className="m-0 text-[12px] font-bold uppercase tracking-[0.08em] text-[#f2a33a]">
                ZENITH TECH
              </Text>
              <Heading className="mb-0 mt-2 text-[22px] font-bold leading-tight text-white">
                Nouvelle demande de devis
              </Heading>
              <Text className="mb-0 mt-2 text-[14px] text-[#c9d6e2]">
                Reçue le {received}
              </Text>
            </Section>

            <Section className="px-7 pb-2 pt-6">
              <Heading
                as="h2"
                className="mb-3 mt-0 text-[16px] font-bold text-[#10243b]"
              >
                Coordonnées
              </Heading>
              <Section>
                <Field label="Nom" value={quote.nom} />
                <Field label="Téléphone" value={quote.telephone} />
                <Field label="Email" value={quote.email} />
                <Field label="Ville" value={quote.ville} />
                <Field
                  label="Type de client"
                  value={
                    quote.typeClient === "entreprise"
                      ? "Entreprise"
                      : "Particulier"
                  }
                />
                <Field
                  label="Canal préféré"
                  value={canalLabel[quote.canal] ?? quote.canal}
                />
              </Section>
            </Section>

            <Section className="px-7 py-2">
              <Heading
                as="h2"
                className="mb-3 mt-4 text-[16px] font-bold text-[#10243b]"
              >
                Produits demandés
              </Heading>
              <Section className="overflow-hidden rounded-xl border border-solid border-[#e6ebf0]">
                <Row className="bg-[#f7f8fa]">
                  <Column className="border-b border-solid border-[#e6ebf0] px-[14px] py-[10px] text-[12px] font-bold uppercase tracking-[0.04em] text-[#3e5873]">
                    Produit
                  </Column>
                  <Column className="border-b border-solid border-[#e6ebf0] px-[14px] py-[10px] text-[12px] font-bold uppercase tracking-[0.04em] text-[#3e5873]">
                    Réf.
                  </Column>
                  <Column
                    align="center"
                    className="w-[72px] border-b border-solid border-[#e6ebf0] px-[14px] py-[10px] text-[12px] font-bold uppercase tracking-[0.04em] text-[#3e5873]"
                  >
                    Qté
                  </Column>
                </Row>
                {quote.items.length ? (
                  quote.items.map((item, idx) => (
                    <Row key={`${item.sku}-${idx}`}>
                      <Column className="border-b border-solid border-[#e6ebf0] px-[14px] py-3 text-[14px] text-[#10243b]">
                        {item.name || "Produit"}
                      </Column>
                      <Column className="whitespace-nowrap border-b border-solid border-[#e6ebf0] px-[14px] py-3 text-[14px] text-[#3e5873]">
                        {item.sku || "—"}
                      </Column>
                      <Column
                        align="center"
                        className="w-[72px] border-b border-solid border-[#e6ebf0] px-[14px] py-3 text-[14px] font-semibold text-[#10243b]"
                      >
                        {item.qty}
                      </Column>
                    </Row>
                  ))
                ) : (
                  <Row>
                    <Column className="px-[14px] py-4 text-[14px] text-[#3e5873]">
                      Aucun produit sélectionné
                    </Column>
                  </Row>
                )}
              </Section>
            </Section>

            <Section className="px-7 pb-7 pt-2">
              <Heading
                as="h2"
                className="mb-3 mt-4 text-[16px] font-bold text-[#10243b]"
              >
                Message / besoin
              </Heading>
              <Section className="rounded-xl border border-solid border-[#e6ebf0] bg-[#f7f8fa] px-4 py-[14px]">
                <Text className="m-0 whitespace-pre-wrap text-[14px] leading-[1.6] text-[#10243b]">
                  {quote.message?.trim() ? quote.message : "Non renseigné"}
                </Text>
              </Section>
            </Section>

            <Hr className="m-0 border-[#e6ebf0]" />
            <Section className="bg-[#fbfcfd] px-7 py-4">
              <Text className="m-0 text-[12px] leading-[1.5] text-[#3e5873]">
                Email généré automatiquement depuis le formulaire de demande de
                devis du site.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
