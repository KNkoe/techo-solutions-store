import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { staffOnly } from '@/access/staffOnly'
import { slugField } from 'payload'

export const Brands: CollectionConfig = {
  slug: 'brands',
  access: {
    create: staffOnly,
    delete: staffOnly,
    read: anyone,
    update: staffOnly,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
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
