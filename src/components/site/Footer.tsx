import Link from 'next/link'

import { Logo } from '@/components/Logo'
import { storeAddress } from '@/config/storeLocation'
import { getCachedSiteSettings } from '@/utilities/getSettings'

export const Footer = async () => {
  const settings = await getCachedSiteSettings()
  const pickupAddress =
    settings.pickup.address === 'Maseru, Lesotho' ? storeAddress : settings.pickup.address

  return (
    <footer className="site-footer">
      <div className="site-shell site-footer__grid">
        <div>
          <Logo variant="footer" />
          <p className="site-footer__copy">{settings.tagline}</p>
        </div>
        <div>
          <h3>Visit</h3>
          <p>{settings.pickup.locationName}</p>
          <p>{pickupAddress}</p>
        </div>
        <div>
          <h3>Hours</h3>
          <p>{settings.pickup.businessHours}</p>
        </div>
        <div>
          <h3>Support</h3>
          <p>
            <a href={`https://wa.me/${settings.supportWhatsAppNumber}`}>WhatsApp us</a>
          </p>
          <p>
            <Link href="/terms">Terms</Link>
          </p>
          <p>
            <Link href="/privacy">Privacy</Link>
          </p>
          <p>
            <Link href="/returns">Returns</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
