import { defineField, defineType } from 'sanity'

export const category = defineType({
  name: 'category',
  title: 'Κατηγορίες',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Τίτλος Κατηγορίας',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Σειρά Εμφάνισης',
      type: 'number',
      description: 'Βάλτε έναν αριθμό για τη σειρά κατάταξης (π.χ. 1 για ΕΙΚΟΝΕΣ, 2 για ΕΙΚΟΝΑΚΙΑ)',
    }),
    defineField({
      name: 'parent',
      title: 'Γονική Κατηγορία',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Επιλέξτε αν αυτή η κατηγορία ανήκει σε μια άλλη',
    }),
  ],
})