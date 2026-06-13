import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2, MessageCircleMore, ShoppingBag } from 'lucide-react'

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
    description:
      product.meta?.description ||
      product.shortDescription ||
      `See photos, price, condition, and availability for ${product.title} at Techo Solutions.`,
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
  const galleryImages = (product.images || [])
    .map((entry) => (typeof entry.image === 'object' ? entry.image : null))
    .filter((image) => image?.url)
  const heroImage = galleryImages[0] || null

  return (
    <div className="site-shell page-section product-detail">
      <div className="product-detail__gallery">
        {heroImage?.url ? (
          <div className="product-shot product-shot--hero">
            <Image
              alt={heroImage.alt}
              src={getMediaUrl(heroImage.sizes?.detail?.url || heroImage.url)}
              width={1400}
              height={1100}
            />
          </div>
        ) : null}

        {galleryImages.length > 1 ? (
          <div className="product-thumb-grid">
            {galleryImages.slice(1).map((image, index) => (
              <div className="product-shot product-shot--thumb" key={index}>
                <Image
                  alt={image?.alt || product.title}
                  src={getMediaUrl(image?.sizes?.card?.url || image?.url)}
                  width={800}
                  height={800}
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="product-detail__summary">
        <div className="detail-panel detail-panel--summary">
          <div className="product-detail__summary-top">
            <p className="product-detail__reference">{product.reference}</p>
            <span className={`product-detail__availability product-detail__availability--${product.status === 'sold' ? 'sold' : 'available'}`}>
              <span className="product-detail__availability-dot" />
              {product.status === 'sold' ? 'Sold out' : 'Still available'}
            </span>
          </div>
          <h1 className="product-detail__title">{product.title}</h1>
          <p className="product-detail__intro">{product.shortDescription}</p>
          <div className="product-trust-row">
            <span>{product.inventoryType === 'brand-new' ? 'Brand New' : 'Pre-Owned'}</span>
            <span>{product.condition.replace('-', ' ')}</span>
            <span>Pickup in Maseru</span>
          </div>
          <div className="product-detail__price-row">
            <div className="product-price">{formatCurrency(product.price, product.currency)}</div>
            <p className="product-detail__price-note">
              {product.status === 'approved'
                ? 'Available to buy now and collect in Maseru.'
                : 'This listing stays visible so you can confirm it has already sold.'}
            </p>
          </div>
          <div className="product-detail__actions">
            {product.status === 'approved' ? (
              <Button asChild className="product-detail__primary-action">
                <Link href={`/checkout/${product.slug}`}>
                  <ShoppingBag className="product-detail__action-icon" />
                  Buy item
                </Link>
              </Button>
            ) : (
              <Button disabled variant="secondary">
                Sold out
              </Button>
            )}
            <Button asChild variant="secondary">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Hi Techo Solutions, I want to ask about ${product.title} (${product.reference}).`)}`}
              >
                <MessageCircleMore className="product-detail__action-icon" />
                Ask on WhatsApp
              </a>
            </Button>
          </div>
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

        {product.trustNotes?.length ? (
          <section className="detail-panel">
            <h2 className="detail-panel__title">What to know before pickup</h2>
            <div className="detail-note-list">
              {product.trustNotes.map((item) => (
                <div className="detail-note" key={item.id || item.note}>
                  <CheckCircle2 className="detail-note__icon" />
                  <span>{item.note}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {product.whatIsIncluded ? (
          <section className="detail-panel">
            <h2 className="detail-panel__title">What&apos;s included</h2>
            <p>{product.whatIsIncluded}</p>
          </section>
        ) : null}

        {product.knownIssues ? (
          <section className="detail-panel">
            <h2 className="detail-panel__title">Known issues</h2>
            <p>{product.knownIssues}</p>
          </section>
        ) : null}
      </div>
    </div>
  )
}
