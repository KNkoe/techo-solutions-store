import type { GlobalConfig } from 'payload'

import { staffOnly } from '@/access/staffOnly'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: () => true,
    update: staffOnly,
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      defaultValue: 'Techo Solutions',
      required: true,
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'We buy and sell anything that works perfectly good.',
      required: true,
    },
    {
      name: 'supportWhatsAppNumber',
      type: 'text',
      required: true,
    },
    {
      name: 'phefoChannelId',
      type: 'text',
    },
    {
      name: 'adminNotificationNumbers',
      type: 'array',
      fields: [
        { name: 'phone', type: 'text', required: true },
      ],
    },
    {
      name: 'pickup',
      type: 'group',
      fields: [
        { name: 'locationName', type: 'text', required: true },
        { name: 'address', type: 'textarea', required: true },
        { name: 'instructions', type: 'textarea' },
        { name: 'businessHours', type: 'textarea' },
      ],
    },
    {
      name: 'policies',
      type: 'group',
      fields: [
        { name: 'returnsSummary', type: 'textarea', required: true },
        { name: 'inspectionSummary', type: 'textarea', required: true },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'defaultTitle', type: 'text', required: true },
        { name: 'defaultDescription', type: 'textarea', required: true },
        { name: 'defaultImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
