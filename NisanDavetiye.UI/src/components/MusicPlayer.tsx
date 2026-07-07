import { useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react'

export interface MusicPlayerHandle {
  start: () => void
}

interface Props {
  url: string
  visible?: boolean
}

export const MusicPlayer = forwardRef<MusicPlayerHandle, Props>(function MusicPlayer(
  { url, visible = true },
  ref,
) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)

  useImperativeHandle(ref, () => ({
    start: async () => {
      const audio = audioRef.current
      if (!audio) return
      audio.volume = 0.5
      try {
        await audio.play()
        setPlaying(true)
        setMuted(false)
      } catch {
        setPlaying(false)
      }
    },
  }))

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    if (muted) {
      audio.volume = 0.5
      audio.play().catch(() => undefined)
      setMuted(false)
      setPlaying(true)
    } else {
      audio.pause()
      setMuted(true)
      setPlaying(false)
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onEnded = () => setPlaying(false)
    audio.addEventListener('ended', onEnded)
    return () => audio.removeEventListener('ended', onEnded)
  }, [])

  if (!url || !visible) return null

  return (
    <>
      <audio ref={audioRef} src={url} loop preload="auto" />
      <button
        type="button"
        className={`ex-music-btn ${playing && !muted ? 'ex-music-btn--on' : ''}`}
        onClick={toggleMute}
        aria-label={playing && !muted ? 'Müziği kapat' : 'Müziği aç'}
      >
        {playing && !muted ? '♫' : '♪'}
      </button>
    </>
  )
})
