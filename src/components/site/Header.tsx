import Link from 'next/link'
import { Search } from 'lucide-react'

import { Logo } from '@/components/Logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getCachedSiteSettings } from '@/utilities/getSettings'

export const Header = async () => {
  const settings = await getCachedSiteSettings()

  return (
    <header className="site-header">
      <div className="site-header__topbar">
        <div className="site-shell site-header__topbar-inner">
          <nav aria-label="Information" className="site-topnav">
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <a href={`https://wa.me/${settings.supportWhatsAppNumber}`}>Support</a>
          </nav>
        </div>
      </div>
      <div className="site-shell site-header__inner">
        <Logo variant="header" />
        <form action="/search" className="site-header__search" role="search">
          <label className="sr-only" htmlFor="header-search-input">
            Search products
          </label>
          <div className="site-header__search-field">
            <span className="site-header__search-icon-wrap">
              <Search aria-hidden="true" className="site-header__search-icon" />
            </span>
            <Input
              className="site-header__search-input"
              id="header-search-input"
              name="q"
              placeholder="Search fridges, TVs, sofas, phones, wardrobes or models"
            />
          </div>
        </form>
        <div className="site-header__actions">
          <Button asChild size="sm" variant="secondary">
            <Link href="/shop">Shop all items</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
