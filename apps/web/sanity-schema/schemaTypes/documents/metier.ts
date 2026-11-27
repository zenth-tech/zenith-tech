import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Pôle ou sous-pôle.
 * - Pôle : `parent` vide (ex : Sécurité électronique et périmétrique).
 * - Sous-pôle : `parent` renseigné (ex : Vidéosurveillance).
 * Les slugs sont uniques sur tout le site : les URL restent plates (/services/videosurveillance).
 */
export const metier = defineType({
  name: "metier",
  title: "Pôle et sous-pôle",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Nom",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug (URL)",
      type: "slug",
      options: { source: "title", maxLength: 60 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "parent",
      title: "Pôle parent",
      type: "reference",
      to: [{ type: "metier" }],
      description:
        "Laissez vide pour un pôle. Renseignez-le pour un sous-pôle (ex : Vidéosurveillance → Sécurité électronique et périmétrique).",
      options: {
        // Seuls les pôles (sans parent) peuvent être choisis : deux niveaux maximum
        filter: ({ document }) => ({
          filter: "!defined(parent) && _id != $id",
          params: { id: String(document._id).replace(/^drafts\./, "") },
        }),
      },
    }),
    defineField({
      name: "aCatalogue",
      title: "Ce pôle a un catalogue de produits",
      type: "boolean",
      description:
        "Activé : il apparaît dans le catalogue avec ses catégories. Désactivé : page de service uniquement. Un pôle qui a des sous-pôles n’a pas de catalogue direct : le catalogue est porté par ses sous-pôles.",
      initialValue: true,
    }),
    defineField({
      name: "accroche",
      title: "Accroche",
      type: "string",
      description:
        "Une phrase pour les cartes et le menu (160 caractères maximum).",
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({ name: "image", title: "Image", type: "imageWithAlt" }),
    defineField({
      name: "prestations",
      title: "Prestations / services",
      type: "array",
      description:
        "Le champ « Groupe » permet d’afficher les prestations en colonnes, comme dans la présentation (ex : Gouvernance et audit, Identités et données).",
      of: [
        defineArrayMember({
          type: "object",
          name: "prestation",
          fields: [
            defineField({
              name: "titre",
              title: "Titre",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "groupe",
              title: "Groupe",
              type: "string",
              description:
                "Optionnel. Écrivez toujours le groupe exactement de la même façon pour regrouper les prestations.",
            }),
          ],
          preview: {
            select: {
              title: "titre",
              groupe: "groupe",
              description: "description",
            },
            prepare: ({ title, groupe, description }) => ({
              title,
              subtitle: [groupe, description].filter(Boolean).join(" · "),
            }),
          },
        }),
      ],
    }),
    defineField({
      name: "referentiels",
      title: "Référentiels et normes",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description:
        "Normes que l’entreprise sait appliquer (ex : ISO 27001, PCI-DSS). Ne les présentez pas comme des certifications, sauf si c’en est une.",
    }),
    defineField({
      name: "references",
      title: "Clients références",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "referenceClient" }],
          options: { filter: "afficherSurSite == true" }, // seuls les clients qui ont donné leur accord
        }),
      ],
      validation: (Rule) => Rule.unique(),
    }),
    defineField({
      name: "ordre",
      title: "Ordre d’affichage",
      type: "number",
      description:
        "Plus petit = affiché en premier. Pour un sous-pôle, l’ordre est celui à l’intérieur de son pôle.",
      initialValue: 10,
    }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
  ],
  orderings: [
    {
      title: "Ordre d’affichage",
      name: "ordreAsc",
      by: [{ field: "ordre", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      parent: "parent.title",
      aCatalogue: "aCatalogue",
      media: "image",
    },
    prepare: ({ title, parent, aCatalogue, media }) => ({
      title,
      subtitle: `${parent ? parent + " › " : "Pôle · "}${aCatalogue ? "catalogue" : "service"}`,
      media,
    }),
  },
});
