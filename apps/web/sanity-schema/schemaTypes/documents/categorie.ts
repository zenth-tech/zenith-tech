import { defineField, defineType } from "sanity";

export const categorie = defineType({
  name: "categorie",
  title: "Catégorie",
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
      name: "metier",
      title: "Pôle ou sous-pôle",
      type: "reference",
      to: [{ type: "metier" }],
      description:
        "Le pôle ou sous-pôle qui contient cette catégorie. Seuls ceux qui ont un catalogue sont proposés.",
      options: { filter: "aCatalogue == true" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({ name: "image", title: "Image", type: "imageWithAlt" }),
    defineField({
      name: "filtres",
      title: "Filtres du catalogue",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
      description:
        "Noms des caractéristiques proposées comme filtres pour cette catégorie (ex : Résolution, Vision nocturne). " +
        "Doivent être écrits exactement comme dans les caractéristiques des produits.",
    }),
    defineField({
      name: "ordre",
      title: "Ordre d’affichage",
      type: "number",
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
    select: { title: "title", metier: "metier.title", media: "image" },
    prepare: ({ title, metier, media }) => ({ title, subtitle: metier, media }),
  },
});
