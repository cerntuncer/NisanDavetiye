import { motion, type Transition } from 'framer-motion'
import type { CSSProperties, SyntheticEvent } from 'react'

type MotionKind = 'sway' | 'sway-reverse' | 'drift' | 'roses-tl' | 'roses-br'

interface Props {
  src: string
  className?: string
  style?: CSSProperties
  motion?: MotionKind
  duration?: number
  onError?: (e: SyntheticEvent<HTMLImageElement>) => void
}

const motionPresets: Record<
  MotionKind,
  { animate: Record<string, number[]>; transition: Transition }
> = {
  sway: {
    animate: { rotate: [0, 2, 0, -1.5, 0] },
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
  },
  'sway-reverse': {
    animate: { rotate: [0, -2, 0, 1.5, 0] },
    transition: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
  },
  drift: {
    animate: { y: [0, -4, 0, -4, 0], x: [0, 3, 0, -3, 0] },
    transition: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
  },
  'roses-tl': {
    animate: { rotate: [0, 1.5, 0, -1, 0], y: [0, -3, 0, 2, 0] },
    transition: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
  },
  'roses-br': {
    animate: { rotate: [0, -1.5, 0, 1, 0], y: [0, 3, 0, -2, 0] },
    transition: { duration: 12, repeat: Infinity, ease: 'easeInOut' },
  },
}

export function FloatingOrnament({
  src,
  className,
  style,
  motion: kind = 'sway',
  duration,
  onError,
}: Props) {
  const preset = motionPresets[kind]
  const transition = duration ? { ...preset.transition, duration } : preset.transition

  return (
    <motion.img
      src={src}
      alt=""
      className={className}
      style={style}
      draggable={false}
      animate={preset.animate}
      transition={transition}
      onError={onError}
    />
  )
}
