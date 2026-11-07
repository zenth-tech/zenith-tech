import {defineArrayMember, defineField, defineType} from 'sanity'
import {API_VERSION} from '../constants'

export const product = defineType({
  name: 'product',
  title: 'Produit',
  type: 'document',
  groups: [
    {name: 'general', title: 'Général', default: true},
    {name: 'contenu', title: 'Contenu'},
    {name: 'specs', title: 'Caractéristiques'},
    {name: 'medias', title: 'Médias'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Nom du produit',
      type: 'string',
      group: 'general',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      group: 'general',
      options: {source: 'name', maxLength: 80},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'sku',
      title: 'SKU (référence interne)',
      type: 'string',
      group: 'general',
      description:
        'Identifiant unique, aussi utilisé pour faire le lien avec l’ERP. Ne le changez jamais après création.',
      validation: (Rule) =>
        Rule.required().custom(async (sku, context) => {
          if (!sku) return true
          const id = (context.document?._id ?? '').replace(/^drafts\./, '')
          const count: number = await context
            .getClient({apiVersion: API_VERSION})
            .fetch(
              `count(*[_type == "product" && sku == $sku && !(_id in [$id, "drafts." + $id])])`,
              {sku, id},
            )
          return count === 0 ? true : 'Ce SKU existe déjà'
        }),
    }),
    defineField({
      name: 'categorie',
      title: 'Catégorie',
      type: 'reference',
      group: 'general',
      to: [{type: 'categorie'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'marque',
      title: 'Marque',
      type: 'string',
      group: 'general',
      description: 'Ex : Hikvision, Dahua',
    }),
    defineField({
      name: 'mettreEnAvant',
      title: 'Mettre en avant sur l’accueil',
      type: 'boolean',
      group: 'general',
      initialValue: false,
    }),

    defineField({
      name: 'accroche',
      title: 'Accroche (cartes du catalogue)',
      type: 'string',
      group: 'contenu',
      description: 'Une phrase qui dit ce que le client y gagne. Max 160 caractères.',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'pointsForts',
      title: 'Points forts',
      type: 'array',
      group: 'contenu',
      of: [{type: 'string'}],
      validation: (Rule) => Rule.max(6).warning('Gardez 3 à 5 points forts maximum'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      group: 'contenu',
      description:
        'Rédigez avec vos propres mots (ne copiez pas le site du fabricant : mauvais pour le SEO).',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Titre', value: 'h2'},
            {title: 'Sous-titre', value: 'h3'},
          ],
          lists: [{title: 'Puces', value: 'bullet'}],
        }),
      ],
    }),

    defineField({
      name: 'caracteristiques',
      title: 'Caractéristiques techniques',
      type: 'array',
      group: 'specs',
      of: [defineArrayMember({type: 'caracteristique'})],
    }),
    defineField({
      name: 'ficheTechnique',
      title: 'Fiche technique (PDF)',
      type: 'file',
      group: 'specs',
      options: {accept: 'application/pdf'},
    }),
    defineField({
      name: 'lienFabricant',
      title: 'Page officielle du fabricant',
      type: 'url',
      group: 'specs',
    }),

    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      group: 'medias',
      of: [defineArrayMember({type: 'imageWithAlt'})],
      validation: (Rule) => Rule.required().min(1).error('Ajoutez au moins une image'),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Vidéo (lien YouTube / Bunny / Vimeo)',
      type: 'url',
      group: 'medias',
      description: 'Ne téléversez pas de vidéo dans Sanity : collez un lien.',
    }),

    defineField({name: 'seo', title: 'SEO', type: 'seo', group: 'seo'}),
  ],
  orderings: [
    {title: 'Nom (A → Z)', name: 'nameAsc', by: [{field: 'name', direction: 'asc'}]},
    {title: 'SKU', name: 'skuAsc', by: [{field: 'sku', direction: 'asc'}]},
  ],
  preview: {
    select: {title: 'name', sku: 'sku', marque: 'marque', media: 'images.0'},
    prepare: ({title, sku, marque, media}) => ({
      title,
      subtitle: [marque, sku].filter(Boolean).join(' · '),
      media,
    }),
  },
})
