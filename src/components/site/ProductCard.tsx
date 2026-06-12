import Image from 'next/image'
import Link from 'next/link'

import type { Product } from '@/payload-types'

import { Button } from '@/components/ui/button'
import {
  getProductAvailabilityLabel,
  getProductBrand,
  getProductCategory,
  getProductImage,
  isProductAvailable,
} from '@/components/site/productCardShared'
import { formatCurrency } from '@/utilities/formatCurrency'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export const ProductCard = ({ product }: { product: Product }) => {
  const image = getProductImage(product)
  const brand = getProductBrand(product)
  const category = getProductCategory(product)
  const availabilityLabel = getProductAvailabilityLabel(product)
  const isAvailable = isProductAvailable(product)
  const specs = [category, product.model, product.storage].filter(Boolean)

  return (
    <article className="product-card">
      <Link className="product-card__media" href={`/products/${product.slug}`}>
        <span className="product-card__status">{availabilityLabel}</span>
        {image?.url ? (
          <Image
            alt={image.alt}
            src={getMediaUrl(image.sizes?.card?.url || image.url)}
            width={520}
            height={520}
          />
        ) : (
          <div className="product-card__placeholder">No image</div>
        )}
      </Link>
      <div className="product-card__body">
        <div className="product-card__meta">
          <span>{product.inventoryType === 'brand-new' ? 'Brand New' : 'Pre-Owned'}</span>
          {brand ? <span>{brand}</span> : null}
        </div>
        <Link className="product-card__title" href={`/products/${product.slug}`}>
          {product.title}
        </Link>
        {specs.length ? <p className="product-card__specs">{specs.join(' • ')}</p> : null}
        <p className="product-card__copy">{product.shortDescription}</p>
        <div className="product-trust-row">
          <span>{product.condition.replace('-', ' ')}</span>
          <span>Pickup in Maseru</span>
          {product.batteryHealth ? <span>{product.batteryHealth} battery</span> : null}
        </div>
        <div className="product-card__footer">
          <div className="product-card__price-block">
            <strong>{formatCurrency(product.price, product.currency)}</strong>
            <span>{isAvailable ? 'Ready for direct checkout' : 'Recently sold listing'}</span>
          </div>
          <div className="product-card__cta-group">
            {isAvailable ? (
              <Button asChild size="sm">
                <Link href={`/checkout/${product.slug}`}>Buy now</Link>
              </Button>
            ) : (
              <Button asChild size="sm" variant="secondary">
                <Link href={`/products/${product.slug}`}>View details</Link>
              </Button>
            )}
            <Link className="quiet-link quiet-link--action" href={`/products/${product.slug}`}>
              Inspect item
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}
