import { SellerFlow } from '@/components/site/SellerFlow'
import { buildMetadata } from '@/utilities/metadata'

export const metadata = buildMetadata({
  title: 'Sell a Device | Techo Solutions',
  description:
    'Verify your WhatsApp number, submit your device photos, and let Techo Solutions review your item for purchase.',
  path: '/sell',
})

export default function SellPage() {
  return (
    <div className="site-shell page-section seller-page">
      <section>
        <p className="section-heading__eyebrow">Sell to Techo Solutions</p>
        <h1>Verify first, then tell us about your device</h1>
        <p className="hero-copy">
          Submission does not guarantee purchase. Final valuation happens after review and possible
          physical inspection.
        </p>
      </section>
      <SellerFlow />
    </div>
  )
}
