import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import RichText from '@/components/RichText'
import { buildMetadata } from '@/utilities/metadata'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const page = result.docs[0]

  if (!page) {
    return buildMetadata({
      title: 'Page not found | Techo Solutions',
      path: `/${slug}`,
    })
  }

  return buildMetadata({
    title: `${page.meta?.title || page.title} | Techo Solutions`,
    description: page.meta?.description || page.summary,
    image: page.meta?.image,
    path: `/${slug}`,
  })
}

export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  const page = result.docs[0]

  if (!page) notFound()

  return (
    <div className="site-shell page-section content-page">
      {page.eyebrow ? <p className="section-heading__eyebrow">{page.eyebrow}</p> : null}
      <h1>{page.title}</h1>
      {page.summary ? <p className="hero-copy">{page.summary}</p> : null}
      <RichText data={page.content} />
    </div>
  )
}
