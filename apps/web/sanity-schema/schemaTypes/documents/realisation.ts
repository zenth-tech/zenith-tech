import {defineArrayMember, defineField, defineType} from 'sanity'

const blocks = defineArrayMember({
  type: 'block',
  styles: [
    {title: 'Normal', value: 'normal'},
    {title: 'Sous-titre', value: 'h3'},
  ],
  lists: [{title: 'Puces', value: 'bullet'}],
})

export const realisation = defineType({
  name: 'realisation',
  title: 'Réalisation',
  type: 'document',
  groups: [
    {name: 'general', title: 'Général', default: true},
    {name: 'contenu', title: 'Étude de cas'},
    {name: 'medias', title: 'Médias'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'title', title: 'Titre', type: 'string', group: 'general', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'general',
      options: {source: 'title', maxLength: 80},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'metiers',
      title: 'Métiers concernés',
      type: 'array',
      group: 'general',
      of: [defineArrayMember({type: 'reference', to: [{type: 'metier'}]})],
      validation: (Rule) => Rule.required().min(1).unique(),
    }),
    defineField({
      name: 'typeClient',
      title: 'Type de client',
      type: 'string',
      group: 'general',
      options: {
        list: [
          {title: 'Particulier', value: 'particulier'},
          {title: 'Entreprise', value: 'entreprise'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'client',
      title: 'Nom du client',
      type: 'string',
      group: 'general',
      description: 'Laissez vide si le client souhaite rester confidentiel.',
    }),
    defineField({name: 'ville', title: 'Ville / lieu', type: 'string', group: 'general'}),
    defineField({name: 'date', title: 'Date de réalisation', type: 'date', group: 'general'}),
    defineField({
      name: 'mettreEnAvant',
      title: 'Mettre en avant sur l’accueil',
      type: 'boolean',
      group: 'general',
      initialValue: false,
    }),

    defineField({
      name: 'resume',
      title: 'Résumé (cartes)',
      type: 'string',
      group: 'contenu',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({name: 'contexte', title: 'Le besoin du client', type: 'array', group: 'contenu', of: [blocks]}),
    defineField({name: 'solution', title: 'Notre solution', type: 'array', group: 'contenu', of: [blocks]}),
    defineField({name: 'resultat', title: 'Résultat', type: 'array', group: 'contenu', of: [blocks]}),
    defineField({
      name: 'produits',
      title: 'Produits installés',
      type: 'array',
      group: 'contenu',
      of: [defineArrayMember({type: 'reference', to: [{type: 'product'}]})],
      validation: (Rule) => Rule.unique(),
    }),

    defineField({
      name: 'images',
      title: 'Photos',
      type: 'array',
      group: 'medias',
      of: [defineArrayMember({type: 'imageWithAlt'})],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Vidéo (lien YouTube / Bunny / Vimeo)',
      type: 'url',
      group: 'medias',
    }),

    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'}),
  ],
  orderings: [{title: 'Plus récentes', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]}],
  preview: {
    select: {title: 'title', ville: 'ville', media: 'images.0'},
    prepare: ({title, ville, media}) => ({title, subtitle: ville, media}),
  },
})
