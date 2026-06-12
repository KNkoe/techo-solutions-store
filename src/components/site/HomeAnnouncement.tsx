import Link from 'next/link'

import type { Category } from '@/payload-types'

export const HomeAnnouncement = ({ categories }: { categories: Category[] }) => {
  if (!categories.length) return null

  return (
    <section className="announcement-strip">
      <div className="site-shell">
        <nav aria-label="Browse categories" className="announcement-strip__nav">
          {categories.map((category) => (
            <Link href={`/shop?category=${category.slug}`} key={category.id}>
              {category.title}
            </Link>
          ))}
        </nav>
      </div>
    </section>
  )
}
