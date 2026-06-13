import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ShoppingBag } from 'lucide-react'

import type { Product } from '@/payload-types'

import { Button } from '@/components/ui/button'
import {
  getProductAvailabilityLabel,
  getProductAvailabilityTone,
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
  const availabilityTone = getProductAvailabilityTone(product)
  const isAvailable = isProductAvailable(product)
  const supportLine = [brand, product.storage || category || product.model].filter(Boolean).slice(0, 2).join(' • ')
  const actionHref = isAvailable ? `/checkout/${product.slug}` : `/products/${product.slug}`
  const actionLabel = isAvailable ? 'Buy item' : 'View item'

  return (
    <article className="product-card">
      <Link className="product-card__media" href={`/products/${product.slug}`}>
        <span className={`product-card__status product-card__status--${availabilityTone}`}>
          <span className="product-card__status-dot" />
          {availabilityLabel}
        </span>
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
          <span>{product.inventoryType === 'brand-new' ? 'Brand new' : 'Pre-owned'}</span>
          {category ? <span>{category}</span> : null}
        </div>
        <Link className="product-card__title" href={`/products/${product.slug}`}>
          {product.title}
        </Link>
        {supportLine ? <p className="product-card__specs">{supportLine}</p> : null}
        <div className="product-card__footer">
          <div className="product-card__price-block">
            <strong>{formatCurrency(product.price, product.currency)}</strong>
            <span>{isAvailable ? 'Pickup in Maseru' : 'Sold out'}</span>
          </div>
          <div className="product-card__cta">
            <Button asChild className="product-card__button" size="sm">
              <Link href={actionHref}>
                {isAvailable ? <ShoppingBag className="product-card__button-icon" /> : <ArrowRight className="product-card__button-icon" />}
                {actionLabel}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  )
}
