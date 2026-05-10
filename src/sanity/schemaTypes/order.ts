import { defineField, defineType } from 'sanity'

export const order = defineType({
  name: 'order',
  title: 'Παραγγελίες',
  type: 'document',
  fields: [
    // --- ΣΤΟΙΧΕΙΑ ΠΑΡΑΓΓΕΛΙΑΣ ---
    defineField({
      name: 'orderNumber',
      title: 'Αριθμός Παραγγελίας',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'orderDate',
      title: 'Ημερομηνία Παραγγελίας',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),

    // --- ΣΤΟΙΧΕΙΑ ΠΕΛΑΤΗ ---
    defineField({
      name: 'customerName',
      title: 'Ονοματεπώνυμο Πελάτη',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Τηλέφωνο',
      type: 'string',
    }),

    // --- ΔΙΕΥΘΥΝΣΗ ΑΠΟΣΤΟΛΗΣ ---
    defineField({
      name: 'shippingAddress',
      title: 'Διεύθυνση Αποστολής',
      type: 'object',
      fields: [
        { name: 'street', title: 'Οδός & Αριθμός', type: 'string' },
        { name: 'city', title: 'Πόλη', type: 'string' },
        { name: 'zipCode', title: 'Τ.Κ.', type: 'string' },
        { name: 'country', title: 'Χώρα', type: 'string', initialValue: 'Ελλάδα' },
      ]
    }),

    // --- ΠΡΟΪΟΝΤΑ ---
    defineField({
      name: 'items',
      title: 'Προϊόντα Παραγγελίας',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'productName', title: 'Προϊόν', type: 'string' },
          { name: 'sku', title: 'SKU', type: 'string' },
          { name: 'quantity', title: 'Ποσότητα', type: 'number' },
          { name: 'price', title: 'Τιμή Μονάδας', type: 'number' },
        ]
      }]
    }),

    // --- ΟΙΚΟΝΟΜΙΚΑ & ΚΑΤΑΣΤΑΣΗ ---
    defineField({
      name: 'totalPrice',
      title: 'Συνολικό Ποσό (€)',
      type: 'number',
    }),
    defineField({
      name: 'status',
      title: 'Κατάσταση Παραγγελίας',
      type: 'string',
      options: {
        list: [
          { title: 'Σε επεξεργασία ⏳', value: 'processing' },
          { title: 'Απεστάλη 🚚', value: 'shipped' },
          { title: 'Παραδόθηκε ✅', value: 'delivered' },
          { title: 'Ακυρώθηκε ❌', value: 'cancelled' },
        ],
        layout: 'radio'
      },
      initialValue: 'processing'
    }),
    defineField({
      name: 'trackingNumber',
      title: 'Αριθμός Αποστολής (Tracking)',
      type: 'string',
      description: 'Εισάγετε τον κωδικό της μεταφορικής μόλις γίνει η αποστολή.'
    }),
    defineField({
      name: 'notes',
      title: 'Σημειώσεις Παραγγελίας',
      type: 'text',
      description: 'Προαιρετικές σημειώσεις από τον πελάτη ή για εσωτερική χρήση.'
    })
  ],
  preview: {
    select: {
      title: 'customerName',
      subtitle: 'orderNumber',
      status: 'status'
    },
    prepare({ title, subtitle, status }) {
      const statusMap: Record<string, string> = {
        processing: '⏳',
        shipped: '🚚',
        delivered: '✅',
        cancelled: '❌'
      }
      return {
        title: `${title} ${statusMap[status] || ''}`,
        subtitle: `#${subtitle}`
      }
    }
  }
})