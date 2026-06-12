import type { HomePage } from '@/payload-types'

import { SectionHeading } from '@/components/site/SectionHeading'

export const HomeFaqSection = ({ items }: { items?: HomePage['faq'] | null }) => {
  if (!items?.length) return null

  return (
    <section className="site-shell page-section">
      <SectionHeading
        eyebrow="FAQ"
        title="Short answers to the parts buyers and sellers ask about most"
      />
      <div className="faq-list">
        {items.map((item) => (
          <details className="faq-item" key={item.id}>
            <summary>{item.question}</summary>
            <p>{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
