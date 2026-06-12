import type { CollectionConfig } from 'payload'

import { staffOnly } from '@/access/staffOnly'
import { makeOrderReference } from '@/utilities/references'

export const Orders: CollectionConfig = {
  slug: 'orders',
  access: {
    create: () => false,
    delete: staffOnly,
    read: staffOnly,
    update: staffOnly,
  },
  admin: {
    useAsTitle: 'reference',
    defaultColumns: ['reference', 'status', 'buyerName', 'buyerPhone', 'updatedAt'],
  },
  fields: [
    {
      name: 'reference',
      type: 'text',
      unique: true,
      index: true,
      required: true,
      defaultValue: makeOrderReference,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending-payment',
      options: [
        { label: 'Pending Payment', value: 'pending-payment' },
        { label: 'Paid', value: 'paid' },
        { label: 'Ready for Pickup', value: 'ready-for-pickup' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'productSnapshot',
      type: 'group',
      fields: [
        { name: 'reference', type: 'text' },
        { name: 'title', type: 'text' },
        { name: 'slug', type: 'text' },
        { name: 'price', type: 'number' },
        { name: 'currency', type: 'text' },
        { name: 'condition', type: 'text' },
        { name: 'pickupOnly', type: 'checkbox' },
        {
          name: 'primaryImage',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'buyerName',
      type: 'text',
      required: true,
    },
    {
      name: 'buyerPhone',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'buyerEmail',
      type: 'email',
    },
    {
      name: 'pickupContactName',
      type: 'text',
      required: true,
    },
    {
      name: 'pickupNotes',
      type: 'textarea',
    },
    {
      name: 'payment',
      type: 'group',
      fields: [
        { name: 'provider', type: 'text', defaultValue: 'mopay', required: true },
        { name: 'providerReference', type: 'text', index: true },
        { name: 'sessionId', type: 'text', index: true },
        { name: 'transactionId', type: 'text' },
        { name: 'checkoutUrl', type: 'text' },
        { name: 'redirectStatus', type: 'text' },
        { name: 'verifiedAt', type: 'date' },
        { name: 'paidAmount', type: 'number' },
        { name: 'lastProviderResponse', type: 'json' },
      ],
    },
    {
      name: 'notificationSummary',
      type: 'group',
      fields: [
        { name: 'buyerNotifiedAt', type: 'date' },
        { name: 'adminNotifiedAt', type: 'date' },
      ],
    },
  ],
  timestamps: true,
}
