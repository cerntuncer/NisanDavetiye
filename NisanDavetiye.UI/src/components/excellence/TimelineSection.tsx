import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import type { Davetiye } from '../../types'
import { excellenceAssets } from '../../excellence/assets'
import { FadeIn } from './FadeIn'
import { FloatingOrnament } from './FloatingOrnament'
import { ExcellenceSectionHeader } from './SectionHeader'

function hideOnError(e: React.SyntheticEvent<HTMLImageElement>) {
  e.currentTarget.style.display = 'none'
}

export function TimelineSection({ items }: { items: Davetiye['timeline'] }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start center'],
  })
  const curtainLeft = useTransform(scrollYProgress, [0, 1], ['5%', '-22%'])
  const curtainRight = useTransform(scrollYProgress, [0, 1], ['5%', '-22%'])

  return (
    <section ref={ref} className="ex-section ex-timeline">
      <div className="ex-timeline__curtains" aria-hidden>
        <motion.img
          src={excellenceAssets.curtainLeft}
          alt=""
          className="ex-timeline__curtain ex-timeline__curtain--left ornament-img"
          style={{ left: curtainLeft, transformOrigin: 'top left' }}
          animate={{ rotate: [0, 2, 0, -1.5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          draggable={false}
          onError={hideOnError}
        />
        <motion.img
          src={excellenceAssets.curtainCenter}
          alt=""
          className="ex-timeline__curtain ex-timeline__curtain--center ornament-img"
          style={{ left: '50%', x: '-50%', transformOrigin: 'top center' }}
          animate={{ rotate: [0, -1.2, 0, 1.2, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          draggable={false}
          onError={hideOnError}
        />
        <motion.img
          src={excellenceAssets.curtainRight}
          alt=""
          className="ex-timeline__curtain ex-timeline__curtain--right ornament-img"
          style={{ right: curtainRight, transformOrigin: 'top right' }}
          animate={{ rotate: [0, -2, 0, 1.5, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          draggable={false}
          onError={hideOnError}
        />
      </div>

      <div className="ex-timeline__inner">
        <FadeIn>
          <ExcellenceSectionHeader title="Gün Akışı" subtitle="Program" />
        </FadeIn>

        <FadeIn delay={0.08}>
          <FloatingOrnament
            src={excellenceAssets.rings}
            className="ex-timeline__rings ornament-img"
            motion="drift"
            onError={hideOnError}
          />
        </FadeIn>

        <FadeIn delay={0.12}>
          <ol className="ex-timeline__list">
            {items.map((item, index) => (
              <li key={item.id} className="ex-timeline__item">
                {index < items.length - 1 && (
                  <span className="ex-timeline__connector" aria-hidden />
                )}
                <span className="ex-timeline__dot" aria-hidden />
                {item.saat && <span className="ex-timeline__time">{item.saat}</span>}
                <h3 className="ex-timeline__heading">{item.baslik}</h3>
                {item.aciklama && <p className="ex-timeline__text">{item.aciklama}</p>}
              </li>
            ))}
          </ol>
        </FadeIn>

        <FloatingOrnament
          src={excellenceAssets.flowerVase}
          className="ex-timeline__vase ornament-img"
          motion="sway-reverse"
          onError={hideOnError}
        />
      </div>
    </section>
  )
}
