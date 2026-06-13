import type { Product } from '@/payload-types'

export const getProductImage = (product: Product) => {
  const media = product.images?.[0]?.image
  return typeof media === 'object' && media ? media : null
}

export const getProductBrand = (product: Product) =>
  typeof product.brand === 'object' && product.brand ? product.brand.title : null

export const getProductCategory = (product: Product) =>
  typeof product.category === 'object' && product.category ? product.category.title : null

export const getProductAvailabilityLabel = (product: Product) =>
  product.status === 'sold' ? 'Sold out' : 'Still available'

export const getProductAvailabilityTone = (product: Product) =>
  product.status === 'sold' ? 'sold' : 'available'

export const isProductAvailable = (product: Product) => product.status === 'approved'
