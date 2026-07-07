import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchDavetiye } from '../api/client'
import { InviteProvider } from '../context/InviteContext'
import type { Davetiye } from '../types'
import { CelebrationsSection } from '../components/excellence/CelebrationsSection'
import { CountdownSection } from '../components/excellence/CountdownSection'
import { ExcellenceFooter } from '../components/excellence/ExcellenceFooter'
import { GallerySection } from '../components/excellence/GallerySection'
import { HeroSection } from '../components/excellence/HeroSection'
import { IntroOverlay } from '../components/excellence/IntroOverlay'
import { SectionDivider } from '../components/excellence/SectionDivider'
import { TimelineSection } from '../components/excellence/TimelineSection'
import { MusicPlayer, type MusicPlayerHandle } from '../components/MusicPlayer'
import { RsvpSection } from '../components/RsvpSection'

const INVITE_ID_PATTERN = /^[a-f0-9]{32}$/i

export function InvitationPage() {
  const { inviteId = '' } = useParams()
  const [data, setData] = useState<Davetiye | null>(null)
  const [error, setError] = useState('')
  const [introDone, setIntroDone] = useState(false)
  const [heroUnlocked, setHeroUnlocked] = useState(false)
  const musicRef = useRef<MusicPlayerHandle>(null)

  const inviteKey = inviteId.trim()

  const refreshDavetiye = useCallback(() => {
    if (!INVITE_ID_PATTERN.test(inviteKey)) {
      setError('Geçersiz davetiye bağlantısı.')
      return
    }

    fetchDavetiye(inviteKey)
      .then(setData)
      .catch(() => setError('Davetiye bulunamadı veya bağlantı geçersiz.'))
  }, [inviteKey])

  useEffect(() => {
    refreshDavetiye()
  }, [refreshDavetiye])

  const handleIntroComplete = () => {
    setIntroDone(true)
  }

  const handleHeroUnlock = useCallback(() => {
    setHeroUnlocked(true)
    document.body.style.overflow = ''
    musicRef.current?.start()
  }, [])

  if (error) {
    return <div className="loading-screen">{error}</div>
  }

  if (!data) {
    return <div className="loading-screen">Yükleniyor...</div>
  }

  const names = `${data.gelinAdi} & ${data.damatAdi}`
  const dateStr = new Date(data.etkinlikTarihi).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <InviteProvider inviteKey={inviteKey}>
      <div className="invitation">
        {!introDone && (
          <IntroOverlay
            videoUrl={data.acilisVideoUrl || '/assets/video/intro.mp4'}
            onComplete={handleIntroComplete}
          />
        )}

        <MusicPlayer ref={musicRef} url={data.muzikUrl} visible={heroUnlocked} />

        {introDone && (
          <>
            <HeroSection
              data={{
                ...data,
                kapakGorselUrl: data.kapakGorselUrl || '/assets/video/hero.mp4',
              }}
              showContent={false}
              playVideo={introDone}
              scrollLocked={!heroUnlocked}
              onUnlockScroll={handleHeroUnlock}
            />
            <main className="invitation__main">
              <CountdownSection
                targetDate={data.etkinlikTarihi}
                description={data.hosgeldinMetni}
              />
              <SectionDivider />
              <CelebrationsSection data={data} />
              <SectionDivider />
              <TimelineSection items={data.timeline} />
              <SectionDivider />
              <GallerySection />
              <SectionDivider />
              <RsvpSection />
              <ExcellenceFooter names={names} dateStr={dateStr} />
            </main>
          </>
        )}
      </div>
    </InviteProvider>
  )
}
