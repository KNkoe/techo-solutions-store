import Link from 'next/link'

import { CatalogFilters } from '@/components/site/CatalogFilters'
import { ProductGrid } from '@/components/site/ProductGrid'
import { buildMetadata } from '@/utilities/metadata'
import { getCatalogFacets, searchCatalog } from '@/utilities/catalog'

export const metadata = buildMetadata({
  title: 'Shop second-hand goods | Techo Solutions',
  description:
    'Browse second-hand furniture, appliances, electronics, and home essentials listed by Techo Solutions in Maseru.',
  keywords: [
    'shop second-hand goods Maseru',
    'used appliances Lesotho',
    'used furniture Maseru',
    'used electronics Maseru',
  ],
  path: '/shop',
})

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const currentPage = Number(params.page || 1)

  const [results, facets] = await Promise.all([
    searchCatalog({
      availability: typeof params.availability === 'string' ? params.availability : undefined,
      brand: typeof params.brand === 'string' ? params.brand : undefined,
      category: typeof params.category === 'string' ? params.category : undefined,
      condition: typeof params.condition === 'string' ? params.condition : undefined,
      inventoryType: typeof params.inventoryType === 'string' ? params.inventoryType : undefined,
      maxPrice: typeof params.maxPrice === 'string' ? Number(params.maxPrice) : undefined,
      minPrice: typeof params.minPrice === 'string' ? Number(params.minPrice) : undefined,
      page: currentPage,
      q: typeof params.q === 'string' ? params.q : undefined,
    }),
    getCatalogFacets(),
  ])

  const totalLabel = `${results.totalDocs} item${results.totalDocs === 1 ? '' : 's'}`
  const activeFilters = [
    typeof params.category === 'string'
      ? facets.categories.find((category) => category.slug === params.category)?.title
      : null,
    typeof params.brand === 'string'
      ? facets.brands.find((brand) => brand.slug === params.brand)?.title
      : null,
    typeof params.availability === 'string'
      ? params.availability === 'sold'
        ? 'Sold archive'
        : 'Still available'
      : null,
    typeof params.inventoryType === 'string'
      ? params.inventoryType === 'brand-new'
        ? 'Brand new'
        : 'Pre-owned'
      : null,
  ].filter(Boolean)

  return (
    <div className="site-shell page-section catalog-layout catalog-layout--shop">
      <CatalogFilters
        brands={facets.brands}
        categories={facets.categories}
        current={{
          availability: typeof params.availability === 'string' ? params.availability : undefined,
          brand: typeof params.brand === 'string' ? params.brand : undefined,
          category: typeof params.category === 'string' ? params.category : undefined,
          inventoryType: typeof params.inventoryType === 'string' ? params.inventoryType : undefined,
          q: typeof params.q === 'string' ? params.q : undefined,
        }}
      />

      <section className="catalog-page">
        <div className="result-toolbar">
          <strong>{totalLabel}</strong>
          {activeFilters.length ? (
            <div className="result-toolbar__chips">
              {activeFilters.map((filter) => (
                <span key={filter}>{filter}</span>
              ))}
            </div>
          ) : null}
        </div>

        {results.docs.length ? (
          <ProductGrid products={results.docs} />
        ) : (
          <div className="empty-state detail-panel">
            <p className="section-heading__eyebrow">No match</p>
            <h2>Nothing matched these filters.</h2>
            <p>Try a broader search or clear the current filters to see the rest of the stock.</p>
            <Link className="quiet-link quiet-link--action" href="/shop">
              Clear filters
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}
