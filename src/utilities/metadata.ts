import type { Metadata } from 'next'

import type { Config, Media } from '@/payload-types'

import { getServerSideURL } from './getURL'

const imageURL = (image?: Media | Config['db']['defaultIDType'] | null) => {
  const base = getServerSideURL()

  if (image && typeof image === 'object' && 'url' in image && image.url) {
    return `${base}${image.sizes?.og?.url || image.url}`
  }

  return `${base}/opengraph-image.png`
}

export const buildMetadata = ({
  description,
  image,
  keywords,
  path = '/',
  title,
}: {
  description?: string | null
  image?: Media | Config['db']['defaultIDType'] | null
  keywords?: string[]
  path?: string
  title: string
}): Metadata => ({
  title,
  description: description || undefined,
  keywords,
  alternates: {
    canonical: path,
  },
  robots: {
    follow: true,
    index: true,
  },
  openGraph: {
    title,
    description: description || undefined,
    url: path,
    siteName: 'Techo Solutions',
    type: 'website',
    images: [
      {
        url: imageURL(image),
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description: description || undefined,
    images: [imageURL(image)],
  },
})
