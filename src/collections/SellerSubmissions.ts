import type { CollectionConfig } from 'payload'

import { staffOnly } from '@/access/staffOnly'
import { makeSellerReference } from '@/utilities/references'

export const SellerSubmissions: CollectionConfig = {
  slug: 'seller-submissions',
  access: {
    create: () => false,
    delete: staffOnly,
    read: staffOnly,
    update: staffOnly,
  },
  admin: {
    useAsTitle: 'reference',
    defaultColumns: ['reference', 'status', 'phone', 'categoryLabel', 'updatedAt'],
  },
  fields: [
    {
      name: 'reference',
      type: 'text',
      unique: true,
      index: true,
      defaultValue: makeSellerReference,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending-verification',
      options: [
        { label: 'Pending Verification', value: 'pending-verification' },
        { label: 'Verified', value: 'verified' },
        { label: 'Under Review', value: 'under-review' },
        { label: 'Inspection Requested', value: 'inspection-requested' },
        { label: 'Accepted', value: 'accepted' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Converted to Product', value: 'converted-to-product' },
      ],
    },
    { name: 'phone', type: 'text', required: true, index: true },
    { name: 'sellerName', type: 'text', required: true },
    {
      name: 'handoverPreference',
      type: 'select',
      required: true,
      options: [
        { label: 'Techo should collect the item', value: 'collect-item' },
        { label: 'Seller will bring it to the store', value: 'bring-to-store' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'categoryLabel', type: 'text', required: true },
        { name: 'brandLabel', type: 'text' },
        { name: 'model', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'condition', type: 'select', required: true, options: ['like-new', 'excellent', 'good', 'fair'] },
        { name: 'askingPrice', type: 'number', min: 0, required: true },
        { name: 'location', type: 'text', required: true },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'storage', type: 'text' },
        { name: 'ram', type: 'text' },
        { name: 'color', type: 'text' },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    {
      name: 'photos',
      type: 'array',
      minRows: 1,
      required: true,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'verification',
      type: 'group',
      fields: [
        { name: 'challengeId', type: 'text', index: true },
        { name: 'verifiedAt', type: 'date' },
      ],
    },
    {
      name: 'convertedProduct',
      type: 'relationship',
      relationTo: 'products',
    },
    {
      name: 'decisionNotes',
      type: 'textarea',
    },
  ],
  timestamps: true,
}
