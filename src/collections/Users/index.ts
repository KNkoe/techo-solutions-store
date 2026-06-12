import type { CollectionConfig } from 'payload'
import type { User } from '@/payload-types'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req }) => ['admin', 'staff'].includes((req.user as User | null)?.role || ''),
    create: ({ req }) => ['admin', 'staff'].includes((req.user as User | null)?.role || ''),
    delete: ({ req }) => ['admin', 'staff'].includes((req.user as User | null)?.role || ''),
    read: ({ req }) => ['admin', 'staff'].includes((req.user as User | null)?.role || ''),
    update: ({ req }) => ['admin', 'staff'].includes((req.user as User | null)?.role || ''),
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'staff',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Staff', value: 'staff' },
      ],
    },
  ],
  timestamps: true,
}
