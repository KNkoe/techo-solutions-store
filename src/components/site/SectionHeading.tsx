export const SectionHeading = ({
  eyebrow,
  title,
  copy,
}: {
  copy?: string
  eyebrow?: string
  title: string
}) => (
  <div className="section-heading">
    {eyebrow ? <p className="section-heading__eyebrow">{eyebrow}</p> : null}
    <h2>{title}</h2>
    {copy ? <p>{copy}</p> : null}
  </div>
)
