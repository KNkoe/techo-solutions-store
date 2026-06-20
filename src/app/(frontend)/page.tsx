import { HomeAnnouncement } from '@/components/site/HomeAnnouncement'
import { HomeHero } from '@/components/site/HomeHero'
import { HomeSellerBand } from '@/components/site/HomeSellerBand'
import { ProductGridSection } from '@/components/site/ProductGridSection'
import { buildMetadata } from '@/utilities/metadata'
import {
  getCatalogFacets,
  getFeaturedProducts,
  getHotDeals,
  getRecentProducts,
  isProductVisible,
} from '@/utilities/catalog'
import { getCachedHomePage, getCachedSiteSettings } from '@/utilities/getSettings'

export async function generateMetadata() {
  const settings = await getCachedSiteSettings()

  return buildMetadata({
    title: settings.seo.defaultTitle,
    description: settings.seo.defaultDescription,
    path: '/',
  })
}

export default async function HomePage() {
  const [home, settings, featured, hotDeals, recent, facets] = await Promise.all([
    getCachedHomePage(),
    getCachedSiteSettings(),
    getFeaturedProducts(8),
    getHotDeals(8),
    getRecentProducts(8),
    getCatalogFacets(),
  ])

  const categories = facets.categories
  const supportHref = `https://wa.me/${settings.supportWhatsAppNumber}`
  const heroProducts = [...featured, ...hotDeals, ...recent]
    .filter((product, index, all) => {
      if (!isProductVisible(product.status)) return false
      return all.findIndex((candidate) => candidate.id === product.id) === index
    })
    .slice(0, 8)

  return (
    <>
      <HomeAnnouncement categories={categories} />
      <HomeHero hero={home.hero} />
      <ProductGridSection products={heroProducts} />
      <HomeSellerBand sellerCTA={home.sellerCTA} supportHref={supportHref} />
    </>
  )
}
