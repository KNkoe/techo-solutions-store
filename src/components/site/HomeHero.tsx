import Image from 'next/image'
import Link from 'next/link'

import type { HomePage, Media } from '@/payload-types'

import { Button } from '@/components/ui/button'
import { getMediaUrl } from '@/utilities/getMediaUrl'

export const HomeHero = ({
  hero,
}: {
  hero: HomePage['hero']
}) => {
  const headline = 'We buy and sell what still works.'
  const subtitle =
    'Shop second-hand furniture, appliances, electronics, and home essentials with real photos and clear availability.'
  const heroImage = typeof hero.image === 'object' && hero.image ? (hero.image as Media) : null
  const heroImageUrl = heroImage?.sizes?.detail?.url || heroImage?.url || '/hero.webp'
  const heroImageAlt = heroImage?.alt || 'Techo Solutions banner hero'
  const isPayloadMediaImage = Boolean(heroImage?.url)

  return (
    <section className="page-section hero-panel">
      <div className="site-shell hero-panel__inner">
        <div className="hero-panel__grid">
          <div className="hero-panel__content">
            <h1>{headline}</h1>
            <p className="hero-subtitle">{subtitle}</p>
            <div className="hero-actions">
              <Button asChild>
                <Link href="/shop">Shop all items</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/sell">Sell an item</Link>
              </Button>
            </div>
          </div>

          <div className="hero-proof">
            <div className="hero-image-card">
              {isPayloadMediaImage ? (
                <Image
                  alt={heroImageAlt}
                  className="hero-image-card__image"
                  src={getMediaUrl(heroImageUrl)}
                  width={1200}
                  height={900}
                  priority
                />
              ) : (
                <img
                  alt={heroImageAlt}
                  className="hero-image-card__image"
                  src={heroImageUrl}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
