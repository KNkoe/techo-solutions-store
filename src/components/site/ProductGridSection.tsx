import type { Product } from '@/payload-types'

import { ProductGrid } from '@/components/site/ProductGrid'
export const ProductGridSection = ({
  products,
}: {
  products: Product[]
}) => (
  <section className="site-shell page-section">
    <ProductGrid products={products} />
  </section>
)
