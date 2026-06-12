import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { buildMetadata } from '@/utilities/metadata'
import { formatCurrency } from '@/utilities/formatCurrency'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { getProductBySlug } from '@/utilities/catalog'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return buildMetadata({
      title: 'Product not found | Techo Solutions',
      path: `/products/${slug}`,
    })
  }

  const image = typeof product.images?.[0]?.image === 'object' ? product.images[0].image : null

  return buildMetadata({
    title: `${product.title} | Techo Solutions`,
    description: product.meta?.description || product.shortDescription,
    image: product.meta?.image || image,
    path: `/products/${product.slug}`,
  })
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  return (
    <div className="site-shell page-section product-detail">
      <div className="product-detail__gallery">
        {(product.images || []).map((entry, index) => {
          const image = typeof entry.image === 'object' ? entry.image : null
          if (!image?.url) return null

          return (
            <div className="product-shot" key={index}>
              <Image
                alt={image.alt}
                src={getMediaUrl(image.sizes?.detail?.url || image.url)}
                width={1200}
                height={1200}
              />
            </div>
          )
        })}
      </div>

      <div className="product-detail__summary">
        <p className="section-heading__eyebrow">{product.reference}</p>
        <h1>{product.title}</h1>
        <p className="hero-copy">{product.shortDescription}</p>
        <div className="product-trust-row">
          <span>{product.inventoryType === 'brand-new' ? 'Brand New' : 'Pre-Owned'}</span>
          <span>{product.condition.replace('-', ' ')}</span>
          <span>{product.status === 'sold' ? 'Sold' : 'Available'}</span>
          <span>Pickup in Maseru</span>
        </div>
        <div className="product-price">{formatCurrency(product.price, product.currency)}</div>
        <div className="hero-actions">
          {product.status === 'approved' ? (
            <Button asChild>
              <Link href={`/checkout/${product.slug}`}>Buy now</Link>
            </Button>
          ) : (
            <Button disabled variant="secondary">
              Sold
            </Button>
          )}
          <Button asChild variant="secondary">
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Hi Techo Solutions, I want to ask about ${product.title} (${product.reference}).`)}`}
            >
              WhatsApp us about this item
            </a>
          </Button>
        </div>

        <div className="spec-grid">
          {product.brand && typeof product.brand === 'object' ? (
            <div>
              <strong>Brand</strong>
              <span>{product.brand.title}</span>
            </div>
          ) : null}
          {product.model ? (
            <div>
              <strong>Model</strong>
              <span>{product.model}</span>
            </div>
          ) : null}
          {product.storage ? (
            <div>
              <strong>Storage</strong>
              <span>{product.storage}</span>
            </div>
          ) : null}
          {product.ram ? (
            <div>
              <strong>RAM</strong>
              <span>{product.ram}</span>
            </div>
          ) : null}
          {product.color ? (
            <div>
              <strong>Color</strong>
              <span>{product.color}</span>
            </div>
          ) : null}
          {product.network ? (
            <div>
              <strong>Network</strong>
              <span>{product.network}</span>
            </div>
          ) : null}
        </div>

        {product.whatIsIncluded ? (
          <section className="detail-panel">
            <h2>What&apos;s included</h2>
            <p>{product.whatIsIncluded}</p>
          </section>
        ) : null}

        {product.knownIssues ? (
          <section className="detail-panel">
            <h2>Known issues</h2>
            <p>{product.knownIssues}</p>
          </section>
        ) : null}
      </div>
    </div>
  )
}
