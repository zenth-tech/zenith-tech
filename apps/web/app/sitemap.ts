import type {MetadataRoute} from 'next'
import {getSitemapPaths} from '@/lib/data'
import {SITE_URL} from '@/lib/site'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const fixed = ['', '/services', '/produits', '/realisations', '/a-propos', '/contact', '/devis']
  const dynamic = await getSitemapPaths()
  return [
    ...fixed.map((p) => ({url: `${SITE_URL}${p}`, changeFrequency: 'weekly' as const, priority: p === '' ? 1 : 0.7})),
    ...dynamic.map((d) => ({url: `${SITE_URL}${d.path}`, lastModified: d.updated, priority: 0.6})),
  ]
}
