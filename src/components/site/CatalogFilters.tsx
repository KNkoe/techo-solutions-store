import Link from 'next/link'

import type { Brand, Category } from '@/payload-types'

import { SectionHeading } from '@/components/site/SectionHeading'

export const CatalogFilters = ({
  brands,
  categories,
}: {
  brands: Brand[]
  categories: Category[]
}) => (
  <aside className="catalog-filters">
    <SectionHeading eyebrow="Filters" title="Refine the catalog" />
    <div className="filter-group">
      <h3>Categories</h3>
      {categories.map((category) => (
        <Link href={`/shop?category=${category.slug}`} key={category.id}>
          {category.title}
        </Link>
      ))}
    </div>
    <div className="filter-group">
      <h3>Brands</h3>
      {brands.map((brand) => (
        <Link href={`/shop?brand=${brand.slug}`} key={brand.id}>
          {brand.title}
        </Link>
      ))}
    </div>
    <div className="filter-group">
      <h3>Availability</h3>
      <Link href="/shop?availability=available">Available</Link>
      <Link href="/shop?availability=sold">Sold archive</Link>
    </div>
  </aside>
)
