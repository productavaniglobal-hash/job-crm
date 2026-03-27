'use client'

import { motion, useReducedMotion } from 'framer-motion'
import {
  fadeInUp,
  scrollPop,
  slideInLeft,
  slideInRight,
} from '../../motion/variants'

const variantMap = {
  slideLeft: slideInLeft,
  slideRight: slideInRight,
  pop: scrollPop,
  fadeUp: fadeInUp,
} as const

export type ScrollRevealVariant = keyof typeof variantMap

type ScrollRevealProps = {
  children: React.ReactNode
  className?: string
  variant?: ScrollRevealVariant
  /** Viewport intersection threshold (0–1). */
  amount?: number | 'some' | 'all'
  /** Delay before animation (seconds). */
  delay?: number
  /** Re-run when scrolling back into view (default: true). Set false to play once. */
  replay?: boolean
}

/**
 * Scroll-triggered motion: horizontal slide, pop-in for mockups, or fade-up fallback.
 */
export function ScrollReveal({
  children,
  className,
  variant = 'fadeUp',
  amount = 0.18,
  delay = 0,
  replay = true,
}: ScrollRevealProps) {
  const reduce = useReducedMotion()
  const v = variantMap[variant]

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      variants={v}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: !replay, amount, margin: '0px 0px -12% 0px' }}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}
