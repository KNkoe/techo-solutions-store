import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getProductCategory, getProductImage } from '@/components/site/productCardShared'
import { CheckoutForm } from '@/components/site/CheckoutForm'
import { buildMetadata } from '@/utilities/metadata'
import { formatCurrency } from '@/utilities/formatCurrency'
import { getProductBySlug } from '@/utilities/catalog'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  return buildMetadata({
    title: product ? `Buy ${product.title} | Techo Solutions` : 'Buy item | Techo Solutions',
    description: product?.shortDescription || 'Buy a listed second-hand item from Techo Solutions in Maseru.',
    path: `/checkout/${slug}`,
  })
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product || product.status !== 'approved') notFound()

  const image = getProductImage(product)
  const category = getProductCategory(product)

  return (
    <div className="site-shell page-section checkout-layout">
      <section className="checkout-summary">
        <div className="route-hero route-hero--compact">
          <p className="section-heading__eyebrow">Buy this item</p>
          <h1>{product.title}</h1>
          <p className="route-hero__copy">{product.shortDescription}</p>
          <Link className="quiet-link quiet-link--action" href={`/products/${product.slug}`}>
            Back to item details
          </Link>
        </div>

        <div className="detail-panel checkout-item-card">
          {image?.url ? (
            <div className="checkout-item-card__media">
              <Image
                alt={image.alt}
                src={getMediaUrl(image.sizes?.card?.url || image.url)}
                width={720}
                height={720}
              />
            </div>
          ) : null}
          <div className="checkout-item-card__body">
            <div className="product-trust-row">
              <span>Still available</span>
              {category ? <span>{category}</span> : null}
              <span>{product.inventoryType === 'brand-new' ? 'Brand new' : 'Pre-owned'}</span>
            </div>
            <p className="product-price">{formatCurrency(product.price, product.currency)}</p>
            <div className="detail-note-list">
              <div className="detail-note">
                <div>
                  <strong>Pickup in Maseru</strong>
                  <p>You will be notified on WhatsApp when the order is ready for handover.</p>
                </div>
              </div>
              <div className="detail-note">
                <div>
                  <strong>Buy this listing directly</strong>
                  <p>This payment page is for this item only, so stock stays accurate.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="checkout-form-panel">
        <CheckoutForm productSlug={product.slug} />
      </section>
    </div>
  )
}
