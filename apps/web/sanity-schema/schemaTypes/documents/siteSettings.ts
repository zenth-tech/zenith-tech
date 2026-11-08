import {defineArrayMember, defineField, defineType} from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Paramètres du site',
  type: 'document',
  groups: [
    {name: 'entreprise', title: 'Entreprise', default: true},
    {name: 'apropos', title: 'Page À propos'},
    {name: 'contact', title: 'Contact'},
    {name: 'reseaux', title: 'Réseaux sociaux'},
    {name: 'seo', title: 'SEO par défaut'},
  ],
  fields: [
    defineField({name: 'nomEntreprise', title: 'Nom de l’entreprise', type: 'string', group: 'entreprise', validation: (Rule) => Rule.required()}),
    defineField({name: 'slogan', title: 'Slogan', type: 'string', group: 'entreprise'}),
    defineField({name: 'logo', title: 'Logo', type: 'imageWithAlt', group: 'entreprise'}),
    defineField({name: 'presentation', title: 'Présentation courte', type: 'text', rows: 4, group: 'entreprise'}),

    defineField({
      name: 'aProposTitre',
      title: 'À propos : titre',
      type: 'string',
      group: 'apropos',
      description: 'Ex : Une référence de la sécurité des bâtiments à Bamako',
    }),
    defineField({
      name: 'aProposTexte',
      title: 'À propos : présentation',
      type: 'array',
      group: 'apropos',
      of: [defineArrayMember({type: 'block', styles: [{title: 'Normal', value: 'normal'}, {title: 'Sous-titre', value: 'h3'}], lists: [{title: 'Puces', value: 'bullet'}]})],
    }),
    defineField({name: 'aProposImage', title: 'À propos : image (équipe ou chantier)', type: 'imageWithAlt', group: 'apropos'}),
    defineField({
      name: 'valeurs',
      title: 'Nos valeurs',
      type: 'array',
      group: 'apropos',
      description: 'Ex : Savoir-faire, Disponibilité, Qualité, Sécurité, Ponctualité.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'valeur',
          fields: [
            defineField({name: 'titre', title: 'Titre', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'description', title: 'Description', type: 'text', rows: 2}),
          ],
          preview: {select: {title: 'titre', subtitle: 'description'}},
        }),
      ],
    }),
    defineField({
      name: 'chiffresCles',
      title: 'Chiffres clés',
      type: 'array',
      group: 'apropos',
      description: 'Uniquement des chiffres que l’entreprise peut justifier. Ex : « 5+ » / « ans d’expérience ».',
      validation: (Rule) => Rule.max(4),
      of: [
        defineArrayMember({
          type: 'object',
          name: 'chiffre',
          fields: [
            defineField({name: 'valeur', title: 'Chiffre', type: 'string', validation: (Rule) => Rule.required()}),
            defineField({name: 'libelle', title: 'Libellé', type: 'string', validation: (Rule) => Rule.required()}),
          ],
          preview: {select: {title: 'valeur', subtitle: 'libelle'}},
        }),
      ],
    }),

    defineField({
      name: 'telephone',
      title: 'Téléphone',
      type: 'array',
      group: 'contact',
      description: 'Affiché tel quel. Ex : +223 XX XX XX XX',
      of: [defineArrayMember({type: 'string'})],
    }),
    defineField({
      name: 'whatsapp',
      title: 'Numéro WhatsApp',
      type: 'array',
      group: 'contact',
      description: 'Format international, chiffres uniquement, sans + ni espaces. Ex : 223XXXXXXXX',
      of: [
        defineArrayMember({
          type: 'string',
          validation: (Rule) => Rule.regex(/^\d{8,15}$/, {name: 'whatsapp'}).error('Chiffres uniquement, 8 à 15 caractères'),
        }),
      ],
    }),
    defineField({name: 'email', title: 'Email de contact', type: 'string', group: 'contact', validation: (Rule) => Rule.email()}),
    defineField({name: 'adresse', title: 'Adresse', type: 'text', rows: 2, group: 'contact'}),
    defineField({name: 'ville', title: 'Ville', type: 'string', group: 'contact'}),
    defineField({name: 'horaires', title: 'Horaires d’ouverture', type: 'text', rows: 3, group: 'contact'}),
    defineField({
      name: 'rccm',
      title: 'RCCM',
      type: 'string',
      group: 'contact',
      description: 'Affiché dans les mentions légales et le pied de page.',
    }),
    defineField({name: 'nina', title: 'NINA', type: 'string', group: 'contact', description: 'Affiché dans les mentions légales.'}),
    defineField({name: 'zoneCouverture', title: 'Zone de couverture', type: 'string', group: 'contact', description: 'Ex : Bamako et tout le Mali'}),

    defineField({name: 'facebook', title: 'Facebook', type: 'url', group: 'reseaux'}),
    defineField({name: 'instagram', title: 'Instagram', type: 'url', group: 'reseaux'}),
    defineField({name: 'linkedin', title: 'LinkedIn', type: 'url', group: 'reseaux'}),
    defineField({name: 'youtube', title: 'YouTube', type: 'url', group: 'reseaux'}),
    defineField({name: 'tiktok', title: 'TikTok', type: 'url', group: 'reseaux'}),

    defineField({name: 'seo', title: 'SEO par défaut', type: 'seo', group: 'seo'}),
  ],
  preview: {prepare: () => ({title: 'Paramètres du site'})},
})
