import {defineArrayMember, defineField, defineType} from 'sanity'

export const metier = defineType({
  name: 'metier',
  title: 'Pôle d’activité',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Nom', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {source: 'title', maxLength: 60},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'aCatalogue',
      title: 'Ce pôle a un catalogue de produits',
      type: 'boolean',
      description:
        'Activé : le pôle apparaît dans /produits avec ses catégories. Désactivé : page de service uniquement (ex : cybersécurité, Microsoft 365).',
      initialValue: true,
    }),
    defineField({name: 'accroche', title: 'Accroche', type: 'string', description: 'Une phrase pour les cartes et le menu.', validation: (Rule) => Rule.max(160)}),
    defineField({name: 'description', title: 'Description', type: 'text', rows: 4}),
    defineField({name: 'image', title: 'Image', type: 'imageWithAlt'}),
    defineField({
      name: 'prestations',
      title: 'Prestations / services',
      type: 'array',
      description: 'Liste des services du pôle (ex : Tests d’intrusion, Sauvegarde et PRA, Portier vidéo).',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'prestation',
          fields: [
            defineField({name: 'titre', title: 'Titre', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 3}),
          ],
          preview: {select: {title: 'titre', subtitle: 'description'}},
        }),
      ],
    }),
    defineField({
      name: 'ordre',
      title: 'Ordre d’affichage',
      type: 'number',
      description: 'Plus petit = affiché en premier (menu, accueil).',
      initialValue: 10,
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  orderings: [{title: 'Ordre d’affichage', name: 'ordreAsc', by: [{field: 'ordre', direction: 'asc'}]}],
  preview: {
    select: {title: 'title', subtitle: 'accroche', media: 'image', aCatalogue: 'aCatalogue'},
    prepare: ({title, subtitle, media, aCatalogue}) => ({
      title,
      subtitle: `${aCatalogue ? 'Catalogue' : 'Service'}${subtitle ? ' · ' + subtitle : ''}`,
      media,
    }),
  },
})
