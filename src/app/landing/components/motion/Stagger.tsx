'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { staggerContainer, staggerContainerSpring, staggerItem, staggerItemSpring } from '../../motion/variants'

type StaggerProps = {
  children: React.ReactNode
  className?: string
  /** `spring` — softer, premium entrance. */
  variant?: 'default' | 'spring'
  /** Replay stagger when section re-enters viewport (default: true). */
  replay?: boolean
}

/** Grid / list wrapper: staggers direct motion children. Use with StaggerItem. */
export function Stagger({ children, className, variant = 'default', replay = true }: StaggerProps) {
  const reduce = useReducedMotion()
  const container = variant === 'spring' ? staggerContainerSpring : staggerContainer

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: !replay, amount: 0.12, margin: '0px 0px -10% 0px' }}
    >
      {children}
    </motion.div>
  )
}

type StaggerItemProps = {
  children: React.ReactNode
  className?: string
  /** Subtle lift on hover (cards / pillars). */
  hoverLift?: boolean
  /** Match parent Stagger `variant`. */
  variant?: 'default' | 'spring'
}

export function StaggerItem({ children, className, hoverLift = false, variant = 'default' }: StaggerItemProps) {
  const reduce = useReducedMotion()
  const item = variant === 'spring' ? staggerItemSpring : staggerItem

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  const hover = hoverLift
    ? {
        y: -6,
        scale: 1.018,
        transition: { type: 'spring' as const, stiffness: 420, damping: 28 },
      }
    : undefined

  return (
    <motion.div className={className} variants={item} whileHover={hover}>
      {children}
    </motion.div>
  )
}
