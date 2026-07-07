import { useEffect, useState } from 'react'
import type { Davetiye } from '../types'
import {
  buildCalendarHref,
  handleCalendarClick,
  shouldOpenCalendarInSameTab,
} from '../utils/calendar'
import {
  buildDriveFolderEmbedUrl,
  buildDriveFolderViewUrl,
  extractDriveFolderId,
} from '../utils/drive'
import { GalleryUpload } from './GalleryUpload'
import { IconCalendar, IconClock, IconMapPin } from './Icons'
import { OrnamentLights } from './OrnamentLights'
import { SectionHeader } from './SectionHeader'

export function Countdown({
  targetDate,
  description,
}: {
  targetDate: string
  description?: string
}) {
  const [left, setLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const target = new Date(targetDate).getTime()
    const tick = () => {
      const diff = Math.max(0, target - Date.now())
      setLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [targetDate])

  const items = [
    { label: 'Gün', value: String(left.days), pad: false },
    { label: 'Saat', value: String(left.hours).padStart(2, '0'), pad: true },
    { label: 'Dakika', value: String(left.minutes).padStart(2, '0'), pad: true },
    { label: 'Saniye', value: String(left.seconds).padStart(2, '0'), pad: true },
  ]

  return (
    <section className="section countdown">
      <SectionHeader
        title="Geri Sayım"
        titleVariant="display"
        description={description}
      />
      <div className="countdown__grid">
        {items.map((item) => (
          <div key={item.label} className="countdown__item">
            <span className="countdown__value">{item.value}</span>
            <span className="countdown__label">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export function HeroSection({ data }: { data: Davetiye }) {
  const isVideo = data.kapakGorselUrl.toLowerCase().endsWith('.mp4')
  const dateStr = new Date(data.etkinlikTarihi)
    .toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
    .toLocaleUpperCase('tr-TR')

  return (
    <header className="hero">
      {isVideo ? (
        <video
          className="hero__video"
          src={data.kapakGorselUrl}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <div
          className="hero__image"
          style={{ backgroundImage: `url(${data.kapakGorselUrl})` }}
        />
      )}
      <div className="hero__overlay" />
      <div className="hero__content">
        <p className="hero__eyebrow">{data.baslik}</p>
        <h1 className="hero__names">
          <span>{data.gelinAdi}</span>
          <span className="hero__amp">&</span>
          <span>{data.damatAdi}</span>
        </h1>
        <p className="hero__date">{dateStr}</p>
      </div>
    </header>
  )
}

function buildCalendarUrl(data: Davetiye) {
  return buildCalendarHref(data)
}

export function DateVenueSection({ data }: { data: Davetiye }) {
  const date = new Date(data.etkinlikTarihi)
  const time = date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })
  const calendarSameTab = shouldOpenCalendarInSameTab()

  return (
    <section className="section date-venue">
      <OrnamentLights className="date-venue__lights" />
      <SectionHeader
        title="Detaylar"
        titleVariant="script"
        subtitle="Bilmeniz gereken her şey"
      />
      <div className="location-panel">
        <div className="location-frame">
          <img
            src="/assets/images/photo-frame.png"
            alt=""
            className="location-frame__img ornament-img"
            draggable={false}
          />
          <div className="location-frame__content">
            <p className="location-frame__label">Konum</p>
            <p className="location-frame__venue">{data.mekanAdi}</p>
            <p className="location-frame__time">
              <IconClock />
              <span>Saat {time}</span>
            </p>
          </div>
        </div>

        <div className="location-panel__actions">
          <a href={data.haritaLink} target="_blank" rel="noreferrer" className="btn-majestic">
            <IconMapPin />
            Google Haritalar
          </a>
          <a
            href={buildCalendarUrl(data)}
            {...(calendarSameTab
              ? { download: 'nis-davetiye.ics' }
              : { target: '_blank', rel: 'noreferrer' })}
            onClick={(e) => handleCalendarClick(data, e)}
            className="btn-majestic"
          >
            <IconCalendar />
            Takvimde Aç
          </a>
        </div>

        <img
          src="/assets/images/music-ornament.png"
          alt=""
          className="location-panel__gramophone ornament-img"
          draggable={false}
        />
      </div>
    </section>
  )
}

export function TimelineSection({ items }: { items: Davetiye['timeline'] }) {
  return (
    <section className="section timeline">
      <SectionHeader
        title="Gün Akışı"
        titleVariant="display"
        subtitle="Sizin için planladıklarımız"
      />
      <ol className="timeline__list">
        {items.map((item, index) => (
          <li key={item.id} className="timeline__item">
            {index > 0 && <span className="timeline__connector" aria-hidden />}
            <span className="timeline__time">{item.saat}</span>
            <h3>{item.baslik}</h3>
            <p>{item.aciklama}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

const RINGS_ILLUSTRATION = '/assets/images/rings-illustration.png'

export function GallerySection({ driveFolderUrl }: { driveFolderUrl: string }) {
  const folderId = extractDriveFolderId(driveFolderUrl)
  const [galleryKey, setGalleryKey] = useState(0)

  return (
    <section className="section gallery">
      <SectionHeader
        title="Galeri"
        titleVariant="script"
        subtitle="Nişan töreninde çekilen fotoğraflar"
        description={
          folderId
            ? 'Anılarınızı bizimle paylaşın — yüklediğiniz fotoğraflar galeri klasörümüze eklenir.'
            : 'Nişan töreninden sonra fotoğraflar burada paylaşılacak.'
        }
      />

      <GalleryUpload onUploaded={() => setGalleryKey((k) => k + 1)} />

      {folderId ? (
        <>
          <div className="gallery__drive">
            <iframe
              key={galleryKey}
              src={buildDriveFolderEmbedUrl(folderId)}
              title="Nişan fotoğraf galerisi"
              loading="lazy"
              allow="autoplay"
            />
          </div>
          <a
            href={buildDriveFolderViewUrl(folderId)}
            target="_blank"
            rel="noreferrer"
            className="btn-outline gallery__drive-link"
          >
            Tüm fotoğrafları Drive'da aç
          </a>
        </>
      ) : (
        <div className="gallery__placeholder">
          <p>Fotoğraflar tören sonrası eklenecek.</p>
        </div>
      )}

      <img
        src={RINGS_ILLUSTRATION}
        alt=""
        className="gallery__rings"
        draggable={false}
      />
    </section>
  )
}
