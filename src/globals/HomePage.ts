import type { GlobalConfig } from 'payload'

import { staffOnly } from '@/access/staffOnly'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  access: {
    read: () => true,
    update: staffOnly,
  },
  fields: [
    {
      name: 'announcement',
      type: 'group',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'message', type: 'text' },
      ],
    },
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
        { name: 'supportLabel', type: 'text' },
        { name: 'primaryCTA', type: 'text', defaultValue: 'Shop items', required: true },
        { name: 'secondaryCTA', type: 'text', defaultValue: 'Sell an item', required: true },
      ],
    },
    {
      name: 'trustPillars',
      type: 'array',
      minRows: 3,
      maxRows: 6,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
      ],
    },
    {
      name: 'howItWorks',
      type: 'group',
      fields: [
        {
          name: 'buyers',
          type: 'array',
          minRows: 3,
          maxRows: 4,
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea', required: true },
          ],
        },
        {
          name: 'sellers',
          type: 'array',
          minRows: 3,
          maxRows: 4,
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea', required: true },
          ],
        },
      ],
    },
    {
      name: 'sellerCTA',
      type: 'group',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'textarea', required: true },
        { name: 'buttonLabel', type: 'text', defaultValue: 'Start selling' },
      ],
    },
    {
      name: 'faq',
      type: 'array',
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer', type: 'textarea', required: true },
      ],
    },
  ],
}
