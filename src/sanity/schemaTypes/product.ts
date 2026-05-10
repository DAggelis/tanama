import { defineField, defineType } from 'sanity'

export const product = defineType({
  name: 'product',
  title: 'Προϊόντα',
  type: 'document',
  fields: [
    // --- ΒΑΣΙΚΕΣ ΠΛΗΡΟΦΟΡΙΕΣ ---
    defineField({ 
      name: 'name', 
      title: 'Όνομα Προϊόντος', 
      type: 'string', 
      validation: (Rule) => Rule.required() 
    }),
    defineField({ 
      name: 'slug', 
      title: 'URL Slug', 
      type: 'slug', 
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required()
    }),
    defineField({ 
      name: 'sku', 
      title: 'Γενικό SKU (Main SKU)', 
      type: 'string',
      description: 'Ο κύριος κωδικός του προϊόντος'
    }),

    // --- SEARCH OPTIMIZATION (ΠΡΟΣΘΗΚΗ) ---
    defineField({
      name: 'searchKeywords',
      title: 'Λέξεις Κλειδιά Αναζήτησης',
      type: 'text',
      description: 'Βοηθήστε την αναζήτηση γράφοντας λέξεις χωρίς τόνους ή greeklish (π.χ. agios, xeiropoihto, panagia).',
      rows: 2,
    }),

    // --- ΠΕΡΙΓΡΑΦΕΣ ---
    defineField({
      name: 'shortDescription',
      title: 'Σύντομη Περιγραφή',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'longDescription',
      title: 'Κύρια Περιγραφή',
      type: 'array', 
      of: [{ type: 'block' }] 
    }),

    // --- ΚΑΤΗΓΟΡΙΟΠΟΙΗΣΗ ---
    defineField({
      name: 'categories',
      title: 'Κατηγορίες Προϊόντος',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      validation: (Rule) => Rule.required().min(1)
    }),
    defineField({
      name: 'theme',
      title: 'Θέμα (Αγιογραφία)',
      type: 'string',
      options: {
        list: [
          { title: 'Άγιοι', value: 'agioi' },
          { title: 'Παναγία', value: 'panagia' },
          { title: 'Παραστάσεις', value: 'parastaseis' },
          { title: 'Χριστός', value: 'christos' }
        ],
        layout: 'dropdown'
      }
    }),

    // --- ΤΕΧΝΙΚΑ ΧΑΡΑΚΤΗΡΙΣΤΙΚΑ ---
    defineField({ 
      name: 'price', 
      title: 'Βασική Τιμή (€)', 
      type: 'number' 
    }),
    defineField({ 
      name: 'weight', 
      title: 'Βάρος (gr)', 
      type: 'number'
    }),
    defineField({ 
      name: 'dimensions', 
      title: 'Διαστάσεις (cm)', 
      type: 'string',
      placeholder: 'π.χ. 20 x 15 cm'
    }),

    // --- ΦΩΤΟΓΡΑΦΙΕΣ ---
    defineField({ 
      name: 'mainImage', 
      title: 'Κύρια Φωτογραφία', 
      type: 'image',
      options: { 
        hotspot: true 
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'gallery',
      title: 'Gallery Φωτογραφιών',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true }
        }
      ]
    }),

    // --- ΠΑΡΑΛΛΑΓΕΣ (VARIANTS) ---
    defineField({
      name: 'variants',
      title: 'Παραλλαγές',
      type: 'array',
      of: [{
        type: 'object',
        name: 'variant',
        fields: [
          { name: 'variantTitle', title: 'Τίτλος Παραλλαγής', type: 'string' },
          { name: 'variantSku', title: 'SKU Παραλλαγής', type: 'string' },
          { name: 'variantPrice', title: 'Τιμή Παραλλαγής (€)', type: 'number' },
          { name: 'variantWeight', title: 'Βάρος (gr)', type: 'number' },
          { name: 'variantDimensions', title: 'Διαστάσεις (cm)', type: 'string' },
          { name: 'variantImage', title: 'Φωτογραφία Παραλλαγής', type: 'image' }
        ],
        preview: {
          select: {
            title: 'variantTitle',
            subtitle: 'variantSku',
            media: 'variantImage'
          }
        }
      }]
    })
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'sku',
      media: 'mainImage'
    }
  }
})