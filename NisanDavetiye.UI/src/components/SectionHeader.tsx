interface Props {
  title: string
  subtitle?: string
  description?: string
  /** script = Majestic el yazısı; display = Türkçe karakterler için serif */
  titleVariant?: 'script' | 'display'
}

export function SectionHeader({
  title,
  subtitle,
  description,
  titleVariant = 'display',
}: Props) {
  return (
    <header className="section-header">
      <h2 className={`section-header__title section-header__title--${titleVariant}`}>
        {title}
      </h2>
      {subtitle && <p className="section-header__eyebrow">{subtitle}</p>}
      {description && <p className="section-header__desc">{description}</p>}
    </header>
  )
}
