import {defineField, defineType} from 'sanity'
import {API_VERSION} from '../constants'

const normalize = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()

export const caracteristique = defineType({
  name: 'caracteristique',
  title: 'Caractéristique',
  type: 'object',
  fields: [
    defineField({
      name: 'cle',
      title: 'Nom',
      type: 'string',
      description: 'Ex : Résolution, Vision nocturne, Puissance. Gardez toujours la même écriture.',
      validation: (Rule) => [
        Rule.required().error('Le nom est obligatoire'),
        // Avertit si le nom ressemble à un filtre de la catégorie mais n’est pas écrit pareil
        // (ex : "resolution" au lieu de "Résolution"), ce qui casserait les filtres du site.
        Rule.custom(async (value, context) => {
          if (!value) return true
          const doc = context.document as {categorie?: {_ref?: string}} | undefined
          const ref = doc?.categorie?._ref
          if (!ref) return true
          const filtres: string[] | null = await context
            .getClient({apiVersion: API_VERSION})
            .fetch(`*[_id == $id][0].filtres`, {id: ref})
          if (!filtres?.length) return true
          const proche = filtres.find((f) => normalize(f) === normalize(value))
          if (proche && proche !== value) return `Écrivez exactement « ${proche} » (filtre de la catégorie)`
          return true
        }).warning(),
      ],
    }),
    defineField({
      name: 'valeur',
      title: 'Valeur',
      type: 'string',
      description: 'Ex : 4 MP, 30 m, 550 W. Même format pour tous les produits (ex : toujours « 4 MP »).',
      validation: (Rule) => Rule.required().error('La valeur est obligatoire'),
    }),
  ],
  preview: {select: {title: 'cle', subtitle: 'valeur'}},
})
