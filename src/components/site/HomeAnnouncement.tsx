'use client'

import Link from 'next/link'
import { Tags, X } from 'lucide-react'
import { useEffect, useId, useState } from 'react'

import type { Category } from '@/payload-types'

const getVisibleCategoryCount = () => {
  if (typeof window === 'undefined') return 1
  if (window.matchMedia('(min-width: 1180px)').matches) return 8
  if (window.matchMedia('(min-width: 900px)').matches) return 6
  if (window.matchMedia('(min-width: 620px)').matches) return 3
  if (window.matchMedia('(min-width: 460px)').matches) return 2
  return 1
}

export const HomeAnnouncement = ({ categories }: { categories: Category[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [visibleCount, setVisibleCount] = useState(1)
  const titleId = useId()

  useEffect(() => {
    const updateVisibleCount = () => setVisibleCount(getVisibleCategoryCount())

    updateVisibleCount()
    window.addEventListener('resize', updateVisibleCount)

    return () => window.removeEventListener('resize', updateVisibleCount)
  }, [])

  useEffect(() => {
    if (!isModalOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsModalOpen(false)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModalOpen])

  if (!categories.length) return null

  const visibleCategories = categories.slice(0, visibleCount)
  const hasMoreCategories = categories.length > visibleCategories.length

  return (
    <section className="announcement-strip">
      <div className="site-shell">
        <div className="announcement-strip__rail">
          <span className="announcement-strip__label">
            <Tags aria-hidden="true" className="announcement-strip__label-icon" />
            Categories
          </span>

          <nav aria-label="Featured categories" className="announcement-strip__nav">
            {visibleCategories.map((category) => (
              <Link href={`/shop?category=${category.slug}`} key={category.id}>
                {category.title}
              </Link>
            ))}
          </nav>

          {hasMoreCategories ? (
            <button
              className="announcement-strip__more"
              onClick={() => setIsModalOpen(true)}
              type="button"
            >
              More
            </button>
          ) : null}
        </div>
      </div>

      {isModalOpen ? (
        <div className="category-modal" role="presentation">
          <button
            aria-label="Close categories"
            className="category-modal__backdrop"
            onClick={() => setIsModalOpen(false)}
            type="button"
          />
          <div aria-labelledby={titleId} aria-modal="true" className="category-modal__panel" role="dialog">
            <div className="category-modal__header">
              <div>
                <p className="section-heading__eyebrow">Browse categories</p>
                <h2 id={titleId}>All categories</h2>
              </div>
              <button
                aria-label="Close categories"
                className="category-modal__close"
                onClick={() => setIsModalOpen(false)}
                type="button"
              >
                <X aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="All categories" className="category-modal__grid">
              {categories.map((category) => (
                <Link
                  href={`/shop?category=${category.slug}`}
                  key={category.id}
                  onClick={() => setIsModalOpen(false)}
                >
                  <strong>{category.title}</strong>
                  <span>{category.inventoryType === 'brand-new' ? 'Brand new' : 'Pre-owned'}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      ) : null}
    </section>
  )
}
