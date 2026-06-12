import { HomeAnnouncement } from '@/components/site/HomeAnnouncement'
import { HomeCategorySection } from '@/components/site/HomeCategorySection'
import { HomeFaqSection } from '@/components/site/HomeFaqSection'
import { HomeHero } from '@/components/site/HomeHero'
import { HomeHowItWorksSection } from '@/components/site/HomeHowItWorksSection'
import { HomeSellerBand } from '@/components/site/HomeSellerBand'
import { ProductGridSection } from '@/components/site/ProductGridSection'
import { buildMetadata } from '@/utilities/metadata'
import {
  getCatalogFacets,
  getFeaturedProducts,
  getHotDeals,
  getRecentProducts,
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
    getFeaturedProducts(4),
    getHotDeals(4),
    getRecentProducts(4),
    getCatalogFacets(),
  ])

  const categories = facets.categories.slice(0, 10)
  const supportHref = `https://wa.me/${settings.supportWhatsAppNumber}`

  return (
    <>
      <HomeAnnouncement categories={categories} />
      <HomeHero hero={home.hero} />
      <HomeCategorySection categories={categories} />
      <ProductGridSection
        copy="Fast-moving stock, real photos, and pickup-only handover in Maseru."
        eyebrow="Featured"
        products={featured}
        title="Verified devices ready for direct checkout"
      />

      {hotDeals.length ? (
        <ProductGridSection
          copy="A compact row for buyers who want the fastest path from browse to payment."
          eyebrow="Hot deals"
          products={hotDeals}
          title="Price-led picks to move quickly"
        />
      ) : null}

      <ProductGridSection
        copy="Useful for repeat buyers checking what just landed."
        eyebrow="Recent arrivals"
        products={recent}
        title="Fresh inventory added to the live catalog"
      />
      <HomeHowItWorksSection howItWorks={home.howItWorks} />
      <HomeSellerBand sellerCTA={home.sellerCTA} supportHref={supportHref} />
      <HomeFaqSection items={home.faq} />
    </>
  )
}
