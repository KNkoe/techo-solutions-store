import Link from 'next/link'
import { ArrowRight, MessageCircleMore } from 'lucide-react'

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
      <div className="seller-band__copy">
        <p className="seller-band__eyebrow">Sell your item</p>
        <h2>{sellerCTA.title}</h2>
        <p>{sellerCTA.description}</p>
      </div>
      <div className="seller-band__rail">
        <div className="seller-band__art" aria-hidden="true">
          <img
            alt=""
            className="seller-band__art-image"
            src="/seller-cta-banner.png"
          />
        </div>
        <div className="seller-band__actions">
          <Button asChild className="seller-band__primary">
            <Link href="/sell">
              <ArrowRight className="seller-band__button-icon" />
              {sellerCTA.buttonLabel}
            </Link>
          </Button>
          <a className="seller-band__support" href={supportHref}>
            <MessageCircleMore className="seller-band__support-icon" />
            Need help selling? Chat with support
          </a>
        </div>
      </div>
    </div>
  </section>
)
