import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { staffOnly } from '@/access/staffOnly'
import { slugField } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: staffOnly,
    delete: staffOnly,
    read: anyone,
    update: staffOnly,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'inventoryType', 'slug', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'inventoryType',
      type: 'select',
      required: true,
      defaultValue: 'pre-owned',
      options: [
        { label: 'Brand New', value: 'brand-new' },
        { label: 'Pre-Owned', value: 'pre-owned' },
      ],
    },
    {
      name: 'summary',
      type: 'textarea',
    },
    {
      name: 'heroLabel',
      type: 'text',
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
    },
    slugField({
      position: undefined,
    }),
  ],
  timestamps: true,
}
