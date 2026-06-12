import type { Product } from '@/payload-types'

import { ProductCard } from '@/components/site/ProductCard'

export const ProductGrid = ({ products }: { products: Product[] }) => (
  <div className="product-grid">
    {products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </div>
)
