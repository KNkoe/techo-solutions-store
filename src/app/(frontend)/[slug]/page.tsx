import configPromise from '@payload-config'
import { ExternalLink, MapPin } from 'lucide-react'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import RichText from '@/components/RichText'
import { googleMapsEmbedUrl, googleMapsSearchUrl, storeAddress } from '@/config/storeLocation'
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

  const isAboutPage = slug === 'about'

  return (
    <div className="site-shell page-section content-page">
      <section className="content-page__hero detail-panel">
        {page.eyebrow ? <p className="section-heading__eyebrow">{page.eyebrow}</p> : null}
        <h1>{page.title}</h1>
        {page.summary ? <p className="route-hero__copy">{page.summary}</p> : null}
      </section>
      <section className="content-page__body detail-panel">
        <RichText data={page.content} />
      </section>
      {isAboutPage ? (
        <section aria-labelledby="about-location-title" className="about-location detail-panel">
          <div className="about-location__content">
            <p className="section-heading__eyebrow">Find us</p>
            <h2 id="about-location-title">Visit Techo Solutions in Maseru</h2>
            <p>
              <MapPin aria-hidden="true" />
              <span>{storeAddress}</span>
            </p>
            <a className="button button--primary" href={googleMapsSearchUrl} rel="noreferrer" target="_blank">
              Open in Google Maps
              <ExternalLink aria-hidden="true" />
            </a>
          </div>
          <div className="about-location__map">
            <iframe
              allowFullScreen
              aria-label="Google Map showing Techo Solutions in Maseru"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={googleMapsEmbedUrl}
              title="Techo Solutions location map"
            />
          </div>
        </section>
      ) : null}
    </div>
  )
}
