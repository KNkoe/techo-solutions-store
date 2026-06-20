import Link from 'next/link'
import { ChevronDown, SlidersHorizontal } from 'lucide-react'

import type { Brand, Category } from '@/payload-types'

export const CatalogFilters = ({
  brands,
  categories,
  current,
}: {
  brands: Brand[]
  categories: Category[]
  current: {
    availability?: string
    brand?: string
    category?: string
    inventoryType?: string
    q?: string
  }
}) => {
  const activeFilterCount = [
    current.category,
    current.brand,
    current.availability,
    current.inventoryType,
    current.q,
  ].filter(Boolean).length
  const hasActiveFilters = activeFilterCount > 0

  return (
    <aside className="catalog-filters">
      <details className="catalog-filters__details" open>
        <summary className="catalog-filters__summary">
          <span className="catalog-filters__summary-label">
            <SlidersHorizontal aria-hidden="true" className="catalog-filters__summary-icon" />
            Filters
          </span>
          <span className="catalog-filters__summary-meta">
            {hasActiveFilters ? `${activeFilterCount} active` : 'Category, type, brand'}
          </span>
          <ChevronDown aria-hidden="true" className="catalog-filters__summary-chevron" />
        </summary>

        <div className="catalog-filters__panel filter-group filter-group--panel">
          <div className="filter-group__header">
            <div className="filter-group__heading">
              <h2>Filters</h2>
              <p>Narrow the listings quickly.</p>
            </div>
            {hasActiveFilters ? (
              <Link className="quiet-link quiet-link--action" href="/shop">
                Clear
              </Link>
            ) : null}
          </div>

          <div className="filter-section">
            <h3>Status</h3>
            <div className="filter-chip-list">
              <Link
                className={current.availability === 'available' ? 'is-active' : undefined}
                href="/shop?availability=available"
              >
                Still available
              </Link>
              <Link
                className={current.availability === 'sold' ? 'is-active' : undefined}
                href="/shop?availability=sold"
              >
                Sold archive
              </Link>
            </div>
          </div>

          <div className="filter-section">
            <h3>Type</h3>
            <div className="filter-chip-list">
              <Link
                className={current.inventoryType === 'pre-owned' ? 'is-active' : undefined}
                href="/shop?inventoryType=pre-owned"
              >
                Pre-owned
              </Link>
              <Link
                className={current.inventoryType === 'brand-new' ? 'is-active' : undefined}
                href="/shop?inventoryType=brand-new"
              >
                Brand new
              </Link>
            </div>
          </div>

          <div className="filter-section">
            <h3>Categories</h3>
            <div className="filter-chip-list">
              {categories.map((category) => (
                <Link
                  className={current.category === category.slug ? 'is-active' : undefined}
                  href={`/shop?category=${category.slug}`}
                  key={category.id}
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Brands</h3>
            <div className="filter-chip-list">
              {brands.map((brand) => (
                <Link
                  className={current.brand === brand.slug ? 'is-active' : undefined}
                  href={`/shop?brand=${brand.slug}`}
                  key={brand.id}
                >
                  {brand.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </details>
    </aside>
  )
}
