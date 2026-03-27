'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

const PARTICLE_POS: { l: string; t: string; d: number }[] = [
  { l: '6%', t: '14%', d: 0 },
  { l: '14%', t: '72%', d: 0.3 },
  { l: '22%', t: '38%', d: 0.6 },
  { l: '31%', t: '88%', d: 0.1 },
  { l: '38%', t: '12%', d: 0.9 },
  { l: '45%', t: '52%', d: 0.4 },
  { l: '52%', t: '28%', d: 1.1 },
  { l: '58%', t: '76%', d: 0.2 },
  { l: '64%', t: '44%', d: 0.7 },
  { l: '71%', t: '18%', d: 1.3 },
  { l: '78%', t: '62%', d: 0.5 },
  { l: '84%', t: '36%', d: 1.0 },
  { l: '91%', t: '84%', d: 0.15 },
  { l: '11%', t: '48%', d: 0.85 },
  { l: '18%', t: '92%', d: 1.2 },
  { l: '95%', t: '12%', d: 0.55 },
  { l: '4%', t: '58%', d: 0.95 },
  { l: '88%', t: '48%', d: 0.35 },
  { l: '42%', t: '8%', d: 1.15 },
  { l: '67%', t: '94%', d: 0.65 },
]

/**
 * Layered background: mesh, aurora, particles, constellation, grid, parallax orbs.
 * Non-interactive; respects prefers-reduced-motion for scroll parallax.
 */
export default function LandingDecor() {
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const yDeep = useTransform(scrollY, [0, 2200], [0, 140])
  const yGrid = useTransform(scrollY, [0, 2200], [0, -45])

  return (
    <div className="lp-decor" aria-hidden>
      <div className="lp-decor-mesh-breathe" />

      {!reduce && (
        <motion.div className="lp-decor-parallax lp-decor-parallax--deep" style={{ y: yDeep }}>
          <div className="lp-decor-aurora" aria-hidden>
            <span className="lp-decor-aurora-blob lp-decor-aurora-blob--1" />
            <span className="lp-decor-aurora-blob lp-decor-aurora-blob--2" />
            <span className="lp-decor-aurora-blob lp-decor-aurora-blob--3" />
          </div>
          <div className="lp-decor-orbs" aria-hidden>
            <span className="lp-decor-orb lp-decor-orb--1" />
            <span className="lp-decor-orb lp-decor-orb--2" />
            <span className="lp-decor-orb lp-decor-orb--3" />
            <span className="lp-decor-orb lp-decor-orb--4" />
          </div>
        </motion.div>
      )}

      {reduce && (
        <>
          <div className="lp-decor-aurora" aria-hidden>
            <span className="lp-decor-aurora-blob lp-decor-aurora-blob--1" />
            <span className="lp-decor-aurora-blob lp-decor-aurora-blob--2" />
            <span className="lp-decor-aurora-blob lp-decor-aurora-blob--3" />
          </div>
          <div className="lp-decor-orbs" aria-hidden>
            <span className="lp-decor-orb lp-decor-orb--1" />
            <span className="lp-decor-orb lp-decor-orb--2" />
            <span className="lp-decor-orb lp-decor-orb--3" />
            <span className="lp-decor-orb lp-decor-orb--4" />
          </div>
        </>
      )}

      <div className="lp-decor-particles" aria-hidden>
        {PARTICLE_POS.map((p, i) => (
          <span
            key={i}
            className="lp-decor-particle"
            style={{ left: p.l, top: p.t, animationDelay: `${p.d}s` }}
          />
        ))}
      </div>

      <svg className="lp-decor-constellation" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="lp-const-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--lp-accent)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--lp-accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--lp-accent)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          className="lp-decor-constellation-path"
          d="M 40 200 L 120 140 L 200 180 L 280 90 L 360 120"
          fill="none"
          stroke="url(#lp-const-line)"
          strokeWidth="0.9"
        />
        <circle className="lp-decor-constellation-node lp-decor-constellation-node--p" cx="40" cy="200" r="2.5" fill="var(--lp-accent)" opacity="0.45" />
        <circle className="lp-decor-constellation-node lp-decor-constellation-node--p" cx="120" cy="140" r="2" fill="var(--lp-accent)" opacity="0.35" />
        <circle className="lp-decor-constellation-node lp-decor-constellation-node--p" cx="200" cy="180" r="2" fill="var(--lp-gradient-end)" opacity="0.4" />
        <circle className="lp-decor-constellation-node lp-decor-constellation-node--p" cx="280" cy="90" r="2.5" fill="var(--lp-accent)" opacity="0.5" />
        <circle className="lp-decor-constellation-node lp-decor-constellation-node--p" cx="360" cy="120" r="2" fill="var(--lp-gradient-end)" opacity="0.38" />
      </svg>

      {!reduce ? (
        <motion.div className="lp-decor-svg-wrap" style={{ y: yGrid }}>
          <svg className="lp-decor-svg lp-decor-svg--grid" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="lp-decor-line" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--lp-accent)" stopOpacity="0" />
                <stop offset="45%" stopColor="var(--lp-accent)" stopOpacity="0.16" />
                <stop offset="100%" stopColor="var(--lp-gradient-end)" stopOpacity="0" />
              </linearGradient>
              <pattern id="lp-decor-grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path
                  d="M 48 0 L 0 0 0 48"
                  fill="none"
                  stroke="var(--lp-border-warm)"
                  strokeWidth="0.55"
                  opacity="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#lp-decor-grid)" className="lp-decor-grid-rect" />
            <path
              className="lp-decor-arc lp-decor-arc--a"
              d="M -80 420 Q 400 200 1200 380"
              fill="none"
              stroke="url(#lp-decor-line)"
              strokeWidth="1.2"
            />
            <path
              className="lp-decor-arc lp-decor-arc--b"
              d="M 200 720 Q 600 520 1280 600"
              fill="none"
              stroke="url(#lp-decor-line)"
              strokeWidth="0.9"
              opacity="0.75"
            />
            <path
              className="lp-decor-arc lp-decor-arc--c"
              d="M 100 180 Q 320 80 520 200"
              fill="none"
              stroke="url(#lp-decor-line)"
              strokeWidth="0.7"
              opacity="0.55"
            />
            <circle className="lp-decor-ring" cx="920" cy="180" r="120" fill="none" stroke="var(--lp-border-warm)" strokeWidth="1" opacity="0.38" />
            <circle
              className="lp-decor-ring lp-decor-ring--spin"
              cx="920"
              cy="180"
              r="140"
              fill="none"
              stroke="url(#lp-decor-line)"
              strokeWidth="1"
              strokeDasharray="8 14"
              opacity="0.55"
            />
            <circle cx="180" cy="620" r="4" fill="var(--lp-accent)" opacity="0.38" className="lp-decor-dot" />
            <circle cx="1040" cy="520" r="3" fill="var(--lp-gradient-end)" opacity="0.42" className="lp-decor-dot lp-decor-dot--delay" />
            <circle cx="520" cy="120" r="2.5" fill="var(--lp-accent)" opacity="0.32" className="lp-decor-dot lp-decor-dot--delay2" />
          </svg>
        </motion.div>
      ) : (
        <div className="lp-decor-svg-wrap">
          <svg className="lp-decor-svg lp-decor-svg--grid" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="lp-decor-line-r" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--lp-accent)" stopOpacity="0" />
                <stop offset="45%" stopColor="var(--lp-accent)" stopOpacity="0.16" />
                <stop offset="100%" stopColor="var(--lp-gradient-end)" stopOpacity="0" />
              </linearGradient>
              <pattern id="lp-decor-grid-r" width="48" height="48" patternUnits="userSpaceOnUse">
                <path
                  d="M 48 0 L 0 0 0 48"
                  fill="none"
                  stroke="var(--lp-border-warm)"
                  strokeWidth="0.55"
                  opacity="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#lp-decor-grid-r)" className="lp-decor-grid-rect" />
            <path
              className="lp-decor-arc lp-decor-arc--a"
              d="M -80 420 Q 400 200 1200 380"
              fill="none"
              stroke="url(#lp-decor-line-r)"
              strokeWidth="1.2"
            />
            <path
              className="lp-decor-arc lp-decor-arc--b"
              d="M 200 720 Q 600 520 1280 600"
              fill="none"
              stroke="url(#lp-decor-line-r)"
              strokeWidth="0.9"
              opacity="0.75"
            />
            <circle className="lp-decor-ring" cx="920" cy="180" r="120" fill="none" stroke="var(--lp-border-warm)" strokeWidth="1" opacity="0.38" />
            <circle
              className="lp-decor-ring lp-decor-ring--spin"
              cx="920"
              cy="180"
              r="140"
              fill="none"
              stroke="url(#lp-decor-line-r)"
              strokeWidth="1"
              strokeDasharray="8 14"
              opacity="0.55"
            />
          </svg>
        </div>
      )}

      <svg
        className="lp-decor-galaxy-hint"
        viewBox="0 0 240 240"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden
      >
        <defs>
          <linearGradient id="lp-galaxy-arm" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="var(--lp-accent)" stopOpacity="0" />
            <stop offset="40%" stopColor="var(--lp-accent)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="var(--lp-gradient-end)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="lp-galaxy-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--lp-accent)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="var(--lp-accent)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="120" cy="120" rx="56" ry="22" fill="none" stroke="url(#lp-galaxy-arm)" strokeWidth="0.8" opacity="0.55" transform="rotate(-24 120 120)" />
        <ellipse cx="120" cy="120" rx="78" ry="32" fill="none" stroke="url(#lp-galaxy-arm)" strokeWidth="0.55" opacity="0.4" transform="rotate(18 120 120)" />
        <circle cx="120" cy="120" r="2.5" fill="url(#lp-galaxy-core)" opacity="0.65" />
      </svg>

      <div className="lp-decor-vignette" />
    </div>
  )
}
