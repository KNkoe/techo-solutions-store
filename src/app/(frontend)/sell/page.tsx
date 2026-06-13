import { SellerFlow } from '@/components/site/SellerFlow'
import { buildMetadata } from '@/utilities/metadata'

export const metadata = buildMetadata({
  title: 'Sell to Techo Solutions | Second-Hand Goods in Maseru',
  description:
    'Sell your second-hand item to Techo Solutions. Share the details, add photos, and wait for a buying decision in Maseru.',
  keywords: ['sell second-hand goods Maseru', 'sell used electronics Lesotho', 'sell used furniture Maseru'],
  path: '/sell',
})

export default function SellPage() {
  return (
    <div className="site-shell page-section seller-page">
      <section className="sell-hero detail-panel">
        <div className="sell-hero__copy">
          <p className="section-heading__eyebrow">Sell to Techo Solutions</p>
          <h1>Start selling your item.</h1>
          <p className="route-hero__copy">Send the details and photos. We&apos;ll reply on WhatsApp.</p>
        </div>
        <div className="sell-hero__image-wrap">
          <img
            alt="Seller standing with household items ready to sell"
            className="sell-hero__image"
            src="/sell-page-hero.png"
          />
        </div>
      </section>
      <SellerFlow />
    </div>
  )
}
