import Link from 'next/link'

import { ProductGrid } from '@/components/site/ProductGrid'
import { SearchForm } from '@/components/site/SearchForm'
import { buildMetadata } from '@/utilities/metadata'
import { searchCatalog } from '@/utilities/catalog'

export const metadata = buildMetadata({
  title: 'Search listed items | Techo Solutions',
  description:
    'Search Techo Solutions listings by product name, brand, model, or item type to check if an item is still available.',
  keywords: ['search second-hand goods Maseru', 'search used electronics Lesotho', 'Techo Solutions search'],
  path: '/search',
})

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const query = typeof params.q === 'string' ? params.q : ''
  const results = await searchCatalog({ q: query })
  const totalLabel = `${results.totalDocs} result${results.totalDocs === 1 ? '' : 's'}`

  return (
    <div className="site-shell page-section search-page">
      <section className="route-hero route-hero--compact">
        <p className="section-heading__eyebrow">Search stock</p>
        <h1>{query ? `Results for "${query}"` : 'Search for a listed item.'}</h1>
        <p className="route-hero__copy">
          Search by product name, model, brand, or item type to confirm whether something is still listed.
        </p>
        <SearchForm placeholder="Search TV, fridge, iPhone, wardrobe or model" />
        <div className="result-toolbar">
          <strong>{query ? totalLabel : 'Start with a product name or model.'}</strong>
          <p>
            {query
              ? 'Open any listing to confirm availability, photos, and pickup details.'
              : 'Use the search bar above to jump straight to what you want.'}
          </p>
        </div>
      </section>

      {results.docs.length ? (
        <ProductGrid products={results.docs} />
      ) : (
        <div className="empty-state detail-panel">
          <p className="section-heading__eyebrow">No results</p>
          <h2>{query ? 'No listed item matched that search.' : 'Search is empty.'}</h2>
          <p>
            {query
              ? 'Try another product name, a shorter model reference, or browse the full catalog.'
              : 'Search by item type, brand, or model number to get direct matches.'}
          </p>
          <Link className="quiet-link quiet-link--action" href="/shop">
            Browse all items
          </Link>
        </div>
      )}
    </div>
  )
}
