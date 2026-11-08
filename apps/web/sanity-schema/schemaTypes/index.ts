import type {SchemaTypeDefinition} from 'sanity'

import {siteSettings} from './documents/siteSettings'
import {metier} from './documents/metier'
import {categorie} from './documents/categorie'
import {product} from './documents/product'
import {realisation} from './documents/realisation'
import {referenceClient} from './documents/referenceClient'

import {seo} from './objects/seo'
import {imageWithAlt} from './objects/imageWithAlt'
import {caracteristique} from './objects/caracteristique'

export const schemaTypes: SchemaTypeDefinition[] = [
  // documents
  siteSettings,
  metier,
  categorie,
  product,
  realisation,
  referenceClient,
  // objets réutilisables
  seo,
  imageWithAlt,
  caracteristique,
]
