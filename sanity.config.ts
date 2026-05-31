'use client'

import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {cloudinaryAssetSourcePlugin} from 'sanity-plugin-cloudinary'
import {media} from 'sanity-plugin-media' // <--- 1. Εισαγωγή του media plugin

import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schema} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  schema,
  plugins: [
    structureTool({structure}),
    visionTool({defaultApiVersion: apiVersion}),
    cloudinaryAssetSourcePlugin(), // Το αφήνουμε void για να φύγει το σφάλμα
    media(),                       // <--- 2. Προσθήκη του media plugin εδώ
  ]
})