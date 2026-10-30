import {createClient} from '@sanity/client'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

/** Sans projectId, le site fonctionne avec les données d'exemple de lib/mock.ts */
export const hasSanity = Boolean(projectId)

export const client = createClient({
  projectId: projectId || 'missing',
  dataset,
  apiVersion: '2026-05-15',
<<<<<<< HEAD
  useCdn: process.env.NODE_ENV === 'production',
=======
  useCdn: false, // false pour avoir les données à jour, true pour la version cache (plus rapide)
>>>>>>> 35689935ed24a2d6c07ae349b229ff95587b7cb3
})
