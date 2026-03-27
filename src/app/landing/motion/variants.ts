import type { Variants } from 'framer-motion'

const ease = [0.25, 0.46, 0.45, 0.94] as const

/** Shared spring for premium entrances (soft, no bounce). */
export const springSoft = {
  type: 'spring' as const,
  stiffness: 118,
  damping: 24,
  mass: 0.82,
}

export const springSnappy = {
  type: 'spring' as const,
  stiffness: 380,
  damping: 28,
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.52, ease },
  },
}

/** Scroll-reveal with spring (FadeIn premium). */
export const fadeInUpSpring: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springSoft,
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.45, ease },
  },
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.06,
    },
  },
}

/** Tighter stagger + spring children (sections). */
export const staggerContainerSpring: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.04,
      when: 'beforeChildren',
    },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.48, ease: 'easeOut' },
  },
}

export const staggerItemSpring: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springSoft,
  },
}

/** Hero column — spring stagger. */
export const heroEntrance: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.072,
      delayChildren: 0.04,
      when: 'beforeChildren',
    },
  },
}

export const heroLine: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springSoft,
  },
}

export const heroMockup: Variants = {
  hidden: { opacity: 0, y: 32, scale: 0.985 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 88,
      damping: 20,
      mass: 0.92,
      delay: 0.1,
    },
  },
}

/** Scroll: text / blocks enter from the side. */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -52 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springSoft,
  },
}

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 52 },
  visible: {
    opacity: 1,
    x: 0,
    transition: springSoft,
  },
}

/** Scroll: mockups / tables scale up into view. */
export const scrollPop: Variants = {
  hidden: { opacity: 0, y: 36, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...springSoft, delay: 0.05 },
  },
}
