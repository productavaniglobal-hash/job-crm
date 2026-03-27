'use client'

import { motion, useReducedMotion } from 'framer-motion'

const SPARKLES = [
  { t: '12%', l: '8%', s: 1, d: 0 },
  { t: '22%', l: '92%', s: 0.85, d: 0.4 },
  { t: '58%', l: '4%', s: 0.7, d: 0.8 },
  { t: '68%', l: '96%', s: 0.75, d: 1.1 },
  { t: '88%', l: '18%', s: 0.65, d: 0.2 },
  { t: '38%', l: '78%', s: 0.9, d: 1.4 },
  { t: '8%', l: '52%', s: 0.55, d: 0.6 },
]

export default function HeroSparkles() {
  const reduce = useReducedMotion()

  if (reduce) return null

  return (
    <div className="lp-hero-sparkles" aria-hidden>
      {SPARKLES.map((p, i) => (
        <motion.span
          key={i}
          className="lp-hero-sparkle"
          style={{
            top: p.t,
            left: p.l,
          }}
          initial={{ opacity: 0.15, scale: p.s }}
          animate={{
            opacity: [0.2, 0.95, 0.25, 0.75, 0.2],
            scale: [p.s, p.s * 1.15, p.s * 0.92, p.s * 1.08, p.s],
          }}
          transition={{
            duration: 4.2 + i * 0.35,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: p.d,
          }}
        />
      ))}
    </div>
  )
}
