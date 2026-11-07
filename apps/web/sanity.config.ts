'use client'

import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity-schema/schemaTypes'
import { structure } from './sanity-schema/structure'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'uw4odwl8'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'

export default defineConfig({
  basePath: '/studio',
  name: 'default',
  title: 'ZENITH TECH Studio',
  projectId,
  dataset,
  plugins: [
    structureTool({ structure }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => schemaType !== 'siteSettings'),
  },
  document: {
    actions: (input, { schemaType }) =>
      schemaType === 'siteSettings'
        ? input.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : input,
  },
})

