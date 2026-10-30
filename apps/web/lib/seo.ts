import type {Metadata} from 'next'
import type {Seo} from './types'

export function seoMeta(seo: Seo | undefined, title: string, description?: string): Metadata {
  return {
    title: seo?.title || title,
    description: seo?.description || description,
  }
}
