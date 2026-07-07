import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props extends HTMLMotionProps<'div'> {
  children: ReactNode
  delay?: number
}

export function FadeIn({ children, delay = 0, className, ...rest }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8%' }}
      transition={{ duration: 0.7, delay, ease: [0.4, 0, 0.2, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}
