import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'title',
      title: 'Titre SEO',
      type: 'string',
      description: 'Idéal : 50-60 caractères. Laissez vide pour utiliser le titre de la page.',
      validation: (Rule) =>
        Rule.max(70).warning('Au-delà de 60-70 caractères, Google tronque le titre.'),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      description: 'Idéal : 120-160 caractères. Donne envie de cliquer.',
      validation: (Rule) =>
        Rule.max(170).warning('Au-delà de 160-170 caractères, Google tronque la description.'),
    }),
    defineField({
      name: 'image',
      title: 'Image de partage (réseaux sociaux)',
      type: 'imageWithAlt',
    }),
  ],
})
