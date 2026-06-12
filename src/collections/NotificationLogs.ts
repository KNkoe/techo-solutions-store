import type { CollectionConfig } from 'payload'

import { staffOnly } from '@/access/staffOnly'
import { makeNotificationReference } from '@/utilities/references'

export const NotificationLogs: CollectionConfig = {
  slug: 'notification-logs',
  access: {
    create: () => false,
    delete: staffOnly,
    read: staffOnly,
    update: staffOnly,
  },
  admin: {
    useAsTitle: 'reference',
    defaultColumns: ['reference', 'eventKey', 'recipient', 'status', 'updatedAt'],
  },
  fields: [
    {
      name: 'reference',
      type: 'text',
      unique: true,
      index: true,
      defaultValue: makeNotificationReference,
    },
    {
      name: 'eventKey',
      type: 'text',
      required: true,
      index: true,
    },
    {
      name: 'recipient',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Sent', value: 'sent' },
        { label: 'Failed', value: 'failed' },
      ],
    },
    {
      name: 'message',
      type: 'textarea',
      required: true,
    },
    {
      name: 'channelId',
      type: 'text',
    },
    {
      name: 'providerMessageId',
      type: 'text',
    },
    {
      name: 'relatedCollection',
      type: 'text',
    },
    {
      name: 'relatedID',
      type: 'text',
    },
    {
      name: 'providerResponse',
      type: 'json',
    },
    {
      name: 'failureReason',
      type: 'textarea',
    },
  ],
  timestamps: true,
}
