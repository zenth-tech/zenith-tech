import {createClient} from '@sanity/client'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

/** Sans projectId, le site fonctionne avec les données d'exemple de lib/mock.ts */
export const hasSanity = Boolean(projectId)

export const client = createClient({
  projectId: projectId || 'missing',
  dataset,
  apiVersion: '2026-05-15',
  useCdn: process.env.NODE_ENV === 'production',
})
