import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { Plugin } from 'payload'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'

import { Page, Product } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

const generateTitle: GenerateTitle<Page | Product> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Techo Solutions` : 'Techo Solutions'
}

const generateURL: GenerateURL<Page | Product> = ({ doc, collectionSlug }) => {
  const url = getServerSideURL()

  if (!doc?.slug) return url

  if (collectionSlug === 'products') return `${url}/products/${doc.slug}`

  return doc.slug === 'home' ? url : `${url}/${doc.slug}`
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'products'],
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  searchPlugin({
    collections: ['products', 'pages'],
  }),
]
