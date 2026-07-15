import { useCallback, useEffect, useRef, useState } from 'react'
import { excellenceAssets } from '../../excellence/assets'

type Phase = 'idle' | 'playing' | 'fading' | 'done'

interface Props {
  videoUrl: string
  /** Intro bitti — hero'yu başlat. Overlay henüz ekranda kalır. */
  onComplete: () => void
  /** Fade animasyonu bittikten sonra overlay kaldırılabilir. */
  onDismissed?: () => void
  /** Hero ilk kareyi boyadıktan sonra true — o zaman fade başlar. */
  readyToFade?: boolean
  /** İlk kullanıcı dokunuşunda (autoplay politikası için) çağrılır. */
  onUserGesture?: () => void
}

export function IntroOverlay({
  videoUrl,
  onComplete,
  onDismissed,
  readyToFade = false,
  onUserGesture,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const startingRef = useRef(false)
  const completedRef = useRef(false)
  const onCompleteRef = useRef(onComplete)
  const onDismissedRef = useRef(onDismissed)
  const [phase, setPhase] = useState<Phase>('idle')

  onCompleteRef.current = onComplete
  onDismissedRef.current = onDismissed

  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    video.load()
  }, [videoUrl])

  // Intro bitti → hero'yu başlat ama henüz fade etme (siyah/beyaz boşluk olmasın).
  useEffect(() => {
    if (phase !== 'playing') return

    const video = videoRef.current
    if (!video) return

    const handleEnded = () => {
      if (!completedRef.current) {
        completedRef.current = true
        onCompleteRef.current()
      }
    }

    video.addEventListener('ended', handleEnded)
    return () => video.removeEventListener('ended', handleEnded)
  }, [phase])

  // Hero hazır olunca fade; kısa geçiş.
  // Intro play başarısız olduysa phase hâlâ idle olabilir — completedRef yeter.
  useEffect(() => {
    if (!readyToFade || phase === 'done' || phase === 'fading') return
    if (!completedRef.current) return
    setPhase('fading')
  }, [readyToFade, phase])

  useEffect(() => {
    if (phase !== 'fading') return

    const t = setTimeout(() => {
      setPhase('done')
      onDismissedRef.current?.()
    }, 450)
    return () => clearTimeout(t)
  }, [phase])

  const startPlayback = useCallback(async () => {
    if (phase !== 'idle' || startingRef.current) return
    startingRef.current = true

    onUserGesture?.()

    const video = videoRef.current
    if (!video) {
      startingRef.current = false
      return
    }

    video.currentTime = 0
    video.muted = true

    try {
      await video.play()
      setPhase('playing')
    } catch {
      if (!completedRef.current) {
        completedRef.current = true
        onCompleteRef.current()
      }
      // Fade'i hemen başlatma — hero hazır olunca readyToFade ile gelecek.
    } finally {
      startingRef.current = false
    }
  }, [phase, onUserGesture])

  if (phase === 'done') return null

  return (
    <div
      className={`ex-intro ${phase === 'playing' ? 'ex-intro--playing' : ''} ${phase === 'fading' ? 'ex-intro--fading' : ''}`}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={phase === 'idle' ? excellenceAssets.introPoster : undefined}
        muted
        playsInline
        preload="auto"
        className="ex-intro__video"
      />
      {phase === 'idle' && (
        <button
          type="button"
          className="ex-intro__tap"
          onPointerDown={(e) => {
            e.preventDefault()
            void startPlayback()
          }}
          onClick={(e) => {
            e.preventDefault()
            void startPlayback()
          }}
          aria-label="Zarfa dokunun, videoyu başlat"
        >
          <span className="ex-intro__hint-text">Zarfa dokunun</span>
        </button>
      )}
    </div>
  )
}
