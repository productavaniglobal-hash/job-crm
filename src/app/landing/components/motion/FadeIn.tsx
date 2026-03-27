'use client'

import { motion, useReducedMotion } from 'framer-motion'
import {
  fadeInUp,
  fadeInUpSpring,
  slideInLeft,
  slideInRight,
  springSoft,
} from '../../motion/variants'

type FadeInProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  amount?: number | 'some' | 'all'
  /** Spring-based vertical reveal (premium). */
  premium?: boolean
  /** Horizontal scroll reveal: text drifts in from the side. */
  slide?: 'left' | 'right'
  /**
   * When true (default), animation runs again each time the block enters the viewport.
   * Set false for a single play (lighter if you prefer).
   */
  replay?: boolean
}

export function FadeIn({
  children,
  className,
  delay = 0,
  amount = 0.2,
  premium = false,
  slide,
  replay = true,
}: FadeInProps) {
  const reduce = useReducedMotion()

  const variants = slide === 'left' ? slideInLeft : slide === 'right' ? slideInRight : premium ? fadeInUpSpring : fadeInUp

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  const useSpring = premium || slide
  const transition = useSpring ? { delay, ...springSoft } : { delay }
  const playOnce = !replay

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: playOnce, amount, margin: '0px 0px -10% 0px' }}
      transition={transition}
    >
      {children}
    </motion.div>
  )
}
