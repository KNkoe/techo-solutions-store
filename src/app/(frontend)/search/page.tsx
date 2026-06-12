import { ProductGrid } from '@/components/site/ProductGrid'
import { SearchForm } from '@/components/site/SearchForm'
import { SectionHeading } from '@/components/site/SectionHeading'
import { searchCatalog } from '@/utilities/catalog'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const query = typeof params.q === 'string' ? params.q : ''
  const results = await searchCatalog({ q: query })

  return (
    <div className="site-shell page-section">
      <SectionHeading
        eyebrow="Search"
        title={query ? `Results for "${query}"` : 'Find a specific item quickly'}
        copy="Search by title, model, brand cues, or storage size to jump straight to live stock."
      />
      <SearchForm />
      <ProductGrid products={results.docs} />
    </div>
  )
}
