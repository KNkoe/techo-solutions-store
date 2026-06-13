import type { HomePage } from '@/payload-types'

import { SectionHeading } from '@/components/site/SectionHeading'

type Steps = NonNullable<HomePage['howItWorks']>

const StepGroup = ({
  eyebrow,
  steps,
  title,
}: {
  eyebrow: string
  steps?: Steps['buyers'] | Steps['sellers']
  title: string
}) => (
  <div>
    <SectionHeading eyebrow={eyebrow} title={title} />
    <div className="steps-grid">
      {(steps || []).map((step) => (
        <article className="step-card" key={step.id}>
          <h3>{step.title}</h3>
          <p>{step.description}</p>
        </article>
      ))}
    </div>
  </div>
)

export const HomeHowItWorksSection = ({ howItWorks }: { howItWorks?: HomePage['howItWorks'] | null }) => (
  <section className="site-shell page-section">
    <SectionHeading
      eyebrow="How it works"
      title="Two clear paths: buy something or sell something"
      copy="The storefront stays simple for buyers while seller review remains controlled."
    />
    <div className="dual-steps">
      <StepGroup eyebrow="Buyers" steps={howItWorks?.buyers} title="Choose an item, pay, then pick it up" />
      <StepGroup
        eyebrow="Sellers"
        steps={howItWorks?.sellers}
        title="Start selling, then send the item details"
      />
    </div>
  </section>
)
