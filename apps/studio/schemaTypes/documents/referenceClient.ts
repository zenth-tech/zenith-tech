import {defineField, defineType} from 'sanity'

export const referenceClient = defineType({
  name: 'referenceClient',
  title: 'Client référence',
  type: 'document',
  fields: [
    defineField({name: 'nom', title: 'Nom du client', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'logo', title: 'Logo', type: 'imageWithAlt', description: 'Optionnel : sans logo, le nom est affiché en texte.'}),
    defineField({name: 'secteur', title: 'Secteur', type: 'string', description: 'Ex : Énergie, Éducation, Construction, Industrie'}),
    defineField({
      name: 'afficherSurSite',
      title: 'Autorisé à être affiché sur le site',
      type: 'boolean',
      description: 'Ne cochez que si le client a donné son accord pour être cité publiquement.',
      initialValue: false,
    }),
    defineField({name: 'ordre', title: 'Ordre d’affichage', type: 'number', initialValue: 10}),
  ],
  orderings: [{title: 'Ordre d’affichage', name: 'ordreAsc', by: [{field: 'ordre', direction: 'asc'}]}],
  preview: {
    select: {title: 'nom', subtitle: 'secteur', media: 'logo', visible: 'afficherSurSite'},
    prepare: ({title, subtitle, media, visible}) => ({
      title,
      subtitle: `${visible ? '✓ affiché' : '✗ masqué'}${subtitle ? ' · ' + subtitle : ''}`,
      media,
    }),
  },
})
