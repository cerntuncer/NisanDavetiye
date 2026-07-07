import { useEffect, useRef, useState } from 'react'

const ZARF_IMAGE = '/assets/images/zarf.png'

interface Props {
  initials: string
  backgroundUrl: string
  onOpen: () => void
}

export function EnvelopeScene({ initials, backgroundUrl, onOpen }: Props) {
  const [opening, setOpening] = useState(false)

  const handleOpen = () => {
    if (opening) return
    setOpening(true)
    setTimeout(onOpen, 1600)
  }

  const useImageBg = !backgroundUrl || backgroundUrl.includes('zarf-arka')

  return (
    <div
      className={`envelope-scene ${useImageBg ? 'envelope-scene--dark' : ''}`}
      style={useImageBg ? undefined : { backgroundImage: `url(${backgroundUrl})` }}
    >
      {!useImageBg && <div className="envelope-scene__overlay" />}
      <p className="envelope-scene__hint">Mühre dokunun</p>
      <div className={`envelope-illustration ${opening ? 'envelope-illustration--open' : ''}`}>
        <img
          src={ZARF_IMAGE}
          alt="Davetiye zarfı"
          className="envelope-illustration__img"
          draggable={false}
        />
        <button
          type="button"
          className={`wax-seal wax-seal--on-envelope ${opening ? 'wax-seal--break' : ''}`}
          onClick={handleOpen}
          aria-label="Mühre dokunun"
        >
          <span>{initials}</span>
        </button>
      </div>
    </div>
  )
}

export function OpeningVideo({
  url,
  names,
  onComplete,
}: {
  url: string
  names: string
  onComplete: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleEnded = () => onComplete()
    video.addEventListener('ended', handleEnded)
    return () => video.removeEventListener('ended', handleEnded)
  }, [onComplete])

  const handleSealClick = async () => {
    if (started) return
    setStarted(true)
    const video = videoRef.current
    if (!video) return
    video.currentTime = 0
    try {
      await video.play()
    } catch {
      onComplete()
    }
  }

  return (
    <div className="opening-video">
      <video
        ref={videoRef}
        src={url}
        muted
        playsInline
        preload="auto"
        className={`opening-video__bg ${started ? 'opening-video__bg--playing' : ''}`}
      />
      {!started && (
        <>
          <div className="opening-video__scrim" aria-hidden />
          <div className="opening-video__overlay">
            <p className="opening-video__subtitle">Nişanımıza davetlisiniz</p>
            <button
              type="button"
              className="opening-video__seal"
              onClick={handleSealClick}
              aria-label="Mühre dokunun, videoyu başlat"
            >
              <span className="opening-video__names">{names}</span>
            </button>
            <p className="opening-video__hint">Mühre dokunun</p>
          </div>
        </>
      )}
    </div>
  )
}
