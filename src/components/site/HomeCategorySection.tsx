import Link from 'next/link'

import type { Category } from '@/payload-types'

import { SectionHeading } from '@/components/site/SectionHeading'

export const HomeCategorySection = ({ categories }: { categories: Category[] }) => (
  <section className="site-shell page-section">
    <SectionHeading
      eyebrow="Browse by category"
      title="Start with the tech you already know you want"
      copy="Techo launches tech-first, while keeping categories editable for staff as the catalog expands."
    />
    <div className="category-grid">
      {categories.map((category) => (
        <Link className="category-tile" href={`/shop?category=${category.slug}`} key={category.id}>
          <strong>{category.title}</strong>
          <span>{category.inventoryType === 'brand-new' ? 'Brand New' : 'Pre-Owned'}</span>
        </Link>
      ))}
    </div>
  </section>
)
