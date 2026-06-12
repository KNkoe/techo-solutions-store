import { CatalogFilters } from '@/components/site/CatalogFilters'
import { ProductGrid } from '@/components/site/ProductGrid'
import { ProductCard } from '@/components/site/ProductCard'
import { SearchForm } from '@/components/site/SearchForm'
import { SectionHeading } from '@/components/site/SectionHeading'
import { getCatalogFacets, searchCatalog } from '@/utilities/catalog'

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

  return (
    <div className="site-shell page-section catalog-layout">
      <CatalogFilters brands={facets.brands} categories={facets.categories} />

      <section>
        <SectionHeading
          eyebrow="Shop"
          title="Phones, laptops, tablets, accessories and gaming gear"
          copy="Real photos, pickup in Maseru, and direct checkout with no cart."
        />
        <SearchForm />
        <ProductGrid products={results.docs} />
      </section>
    </div>
  )
}
