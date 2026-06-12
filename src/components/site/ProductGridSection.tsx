import type { Product } from '@/payload-types'

import { ProductGrid } from '@/components/site/ProductGrid'
import { SectionHeading } from '@/components/site/SectionHeading'

export const ProductGridSection = ({
  copy,
  eyebrow,
  products,
  title,
}: {
  copy?: string
  eyebrow: string
  products: Product[]
  title: string
}) => (
  <section className="site-shell page-section">
    <SectionHeading copy={copy} eyebrow={eyebrow} title={title} />
    <ProductGrid products={products} />
  </section>
)
