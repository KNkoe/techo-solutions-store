import Link from 'next/link'
import { ChevronDown, Tags } from 'lucide-react'

import type { Category } from '@/payload-types'

export const HomeAnnouncement = ({ categories }: { categories: Category[] }) => {
  if (!categories.length) return null

  return (
    <section className="announcement-strip">
      <div className="site-shell">
        <details className="announcement-strip__details">
          <summary className="announcement-strip__summary">
            <span className="announcement-strip__summary-label">
              <Tags aria-hidden="true" className="announcement-strip__summary-icon" />
              Browse categories
            </span>
            <span className="announcement-strip__summary-meta">{categories.length} categories</span>
            <ChevronDown aria-hidden="true" className="announcement-strip__summary-chevron" />
          </summary>

          <nav aria-label="Browse categories" className="announcement-strip__nav">
            {categories.map((category) => (
              <Link href={`/shop?category=${category.slug}`} key={category.id}>
                {category.title}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </section>
  )
}
