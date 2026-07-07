import { useEffect, useState } from 'react'
import { excellenceAssets } from '../../excellence/assets'
import { FadeIn } from './FadeIn'
import { ExcellenceSectionHeader } from './SectionHeader'

function hideOnError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = 'none'
}

export function CountdownSection({
  targetDate,
  description,
}: {
  targetDate: string
  description?: string
}) {
  const [left, setLeft] = useState({ days: 0, hours: 0, minutes: 0 })

  useEffect(() => {
    const target = new Date(targetDate).getTime()
    const tick = () => {
      const diff = Math.max(0, target - Date.now())
      setLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  const items = [
    { label: 'Gün', value: String(left.days).padStart(2, '0') },
    { label: 'Saat', value: String(left.hours).padStart(2, '0') },
    { label: 'Dakika', value: String(left.minutes).padStart(2, '0') },
  ]

  return (
    <section id="countdown" className="ex-section ex-countdown">
      <div className="ex-countdown__frame" aria-hidden>
        <img
          src={excellenceAssets.columnLeft}
          alt=""
          className="ex-countdown__column ex-countdown__column--left ornament-img"
          draggable={false}
          onError={hideOnError}
        />
        <img
          src={excellenceAssets.columnRight}
          alt=""
          className="ex-countdown__column ex-countdown__column--right ornament-img"
          draggable={false}
          onError={hideOnError}
        />
      </div>

      <div className="ex-countdown__inner">
        <FadeIn>
          <ExcellenceSectionHeader title="Geri Sayım" description={description} />
        </FadeIn>
        <FadeIn delay={0.15}>
          <div className="ex-countdown__grid">
            {items.map((item, i) => (
              <div key={item.label} className="ex-countdown__cell-wrap">
                {i > 0 && <span className="ex-countdown__sep" aria-hidden />}
                <div className="ex-countdown__cell">
                  <span className="ex-countdown__value">{item.value}</span>
                  <span className="ex-countdown__label">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  )
}
