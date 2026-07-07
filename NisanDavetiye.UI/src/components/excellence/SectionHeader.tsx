interface Props {
  title: string
  subtitle?: string
  description?: string
  titleScript?: boolean
}

export function ExcellenceSectionHeader({ title, subtitle, description, titleScript }: Props) {
  return (
    <header className="ex-section-header">
      <h2 className={`ex-section-title ${titleScript ? 'ex-section-title--script' : ''}`}>
        {title}
      </h2>
      {subtitle && <p className="ex-section-eyebrow">{subtitle}</p>}
      {description && <p className="ex-section-desc">{description}</p>}
    </header>
  )
}
