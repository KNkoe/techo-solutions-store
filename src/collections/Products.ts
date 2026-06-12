import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { staffOnly } from '@/access/staffOnly'
import { makeProductReference } from '@/utilities/references'
import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from 'payload'

const conditionOptions = ['new', 'like-new', 'excellent', 'good', 'fair'] as const
const statusOptions = ['draft', 'approved', 'reserved', 'sold'] as const

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: staffOnly,
    delete: staffOnly,
    read: anyone,
    update: staffOnly,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['reference', 'title', 'status', 'price', 'condition', 'updatedAt'],
  },
  defaultPopulate: {
    title: true,
    slug: true,
    price: true,
    reference: true,
    status: true,
    condition: true,
    inventoryType: true,
  },
  fields: [
    {
      name: 'reference',
      type: 'text',
      unique: true,
      index: true,
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
      defaultValue: makeProductReference,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'shortDescription',
      type: 'textarea',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          min: 0,
          required: true,
        },
        {
          name: 'currency',
          type: 'text',
          defaultValue: 'LSL',
          required: true,
          admin: {
            readOnly: true,
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'status',
          type: 'select',
          required: true,
          defaultValue: 'draft',
          options: statusOptions.map((value) => ({
            label: value.replace('-', ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
            value,
          })),
        },
        {
          name: 'condition',
          type: 'select',
          required: true,
          options: conditionOptions.map((value) => ({
            label: value.replace('-', ' ').replace(/\b\w/g, (char) => char.toUpperCase()),
            value,
          })),
        },
      ],
    },
    {
      type: 'row',
      fields: [
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
          name: 'pickupOnly',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'relationship',
          relationTo: 'categories',
          required: true,
        },
        {
          name: 'brand',
          type: 'relationship',
          relationTo: 'brands',
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'model', type: 'text' },
        { name: 'color', type: 'text' },
        { name: 'network', type: 'text' },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'storage', type: 'text' },
        { name: 'ram', type: 'text' },
        { name: 'batteryHealth', type: 'text' },
      ],
    },
    {
      name: 'images',
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
      name: 'whatIsIncluded',
      type: 'textarea',
    },
    {
      name: 'knownIssues',
      type: 'textarea',
    },
    {
      name: 'trustNotes',
      type: 'array',
      fields: [
        {
          name: 'note',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'featured', type: 'checkbox', defaultValue: false },
        { name: 'recentlyAdded', type: 'checkbox', defaultValue: true },
        { name: 'hotDeal', type: 'checkbox', defaultValue: false },
      ],
    },
    {
      name: 'meta',
      label: 'SEO',
      type: 'group',
      fields: [
        OverviewField({
          titlePath: 'meta.title',
          descriptionPath: 'meta.description',
          imagePath: 'meta.image',
        }),
        MetaTitleField({
          hasGenerateFn: true,
        }),
        MetaImageField({
          relationTo: 'media',
        }),
        MetaDescriptionField({}),
        PreviewField({
          hasGenerateFn: true,
          titlePath: 'meta.title',
          descriptionPath: 'meta.description',
        }),
      ],
    },
    slugField({
      position: undefined,
    }),
  ],
  timestamps: true,
}
