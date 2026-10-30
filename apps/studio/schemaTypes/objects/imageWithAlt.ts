import {defineField, defineType} from 'sanity'

export const imageWithAlt = defineType({
  name: 'imageWithAlt',
  title: 'Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Texte alternatif',
      type: 'string',
      description:
        'Décrivez l’image (SEO + accessibilité). Ex : « Caméra dôme installée sur la façade d’un immeuble ».',
      validation: (Rule) => Rule.required().error('Le texte alternatif est obligatoire'),
    }),
  ],
})
