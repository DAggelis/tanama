import { type SchemaTypeDefinition } from 'sanity'
import { product } from './product'
import { category } from './category'
import { order } from './order' // Εισαγωγή εδώ

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [product, category, order], // Προσθήκη εδώ
}