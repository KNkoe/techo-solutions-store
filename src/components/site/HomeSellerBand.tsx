import Link from 'next/link'

import type { HomePage } from '@/payload-types'

import { Button } from '@/components/ui/button'

export const HomeSellerBand = ({
  sellerCTA,
  supportHref,
}: {
  sellerCTA: HomePage['sellerCTA']
  supportHref: string
}) => (
  <section className="seller-band">
    <div className="site-shell seller-band__inner">
      <div>
        <p className="section-heading__eyebrow">Sell a device</p>
        <h2>{sellerCTA.title}</h2>
        <p>{sellerCTA.description}</p>
      </div>
      <div className="hero-actions">
        <Button asChild variant="secondary">
          <Link href="/sell">{sellerCTA.buttonLabel}</Link>
        </Button>
        <Button asChild variant="secondary">
          <a href={supportHref}>WhatsApp Support</a>
        </Button>
      </div>
    </div>
  </section>
)
