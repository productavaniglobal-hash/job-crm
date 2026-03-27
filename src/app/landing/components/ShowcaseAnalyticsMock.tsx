'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { springSoft, staggerContainer, staggerItem } from '../motion/variants'

const BAR_HEIGHTS = [52, 38, 62, 48, 72, 58, 78, 64, 70, 55, 82, 68]

/** SVG path for revenue trend (area + line share same points). */
const CHART_W = 400
const CHART_H = 110
const BASE_Y = CHART_H + 4
const POINTS: [number, number][] = [
  [0, 92],
  [36, 88],
  [72, 82],
  [108, 85],
  [144, 72],
  [180, 76],
  [216, 58],
  [252, 62],
  [288, 48],
  [324, 44],
  [360, 38],
  [400, 34],
]

function buildLineD(): string {
  return POINTS.map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`)).join(' ')
}

function buildAreaD(): string {
  const line = buildLineD()
  return `${line} L ${CHART_W} ${BASE_Y} L 0 ${BASE_Y} Z`
}

/** Replay chart motion when scrolling away and back. */
const viewReplay = { once: false as const, amount: 0.2 as const }

const statItems = [
  { label: 'MRR', value: '$42K', valueClass: 'lp-gradient-text' as const },
  { label: 'Deals', value: '127', valueClass: undefined },
  { label: 'Win Rate', value: '68%', valueClass: 'lp-stat-positive' as const },
  { label: 'Avg Cycle', value: '14d', valueClass: undefined },
]

export default function ShowcaseAnalyticsMock() {
  const reduce = useReducedMotion()
  const lineD = buildLineD()
  const areaD = buildAreaD()

  return (
    <div className="lp-analytics-mock">
      <motion.div
        className="lp-analytics-row"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ ...viewReplay, amount: 0.35 }}
      >
        {statItems.map((s) => (
          <motion.div key={s.label} className="lp-analytics-stat" variants={staggerItem}>
            <div className="lp-analytics-stat-label">{s.label}</div>
            <div
              className={
                s.valueClass ? `lp-analytics-stat-value ${s.valueClass}` : 'lp-analytics-stat-value'
              }
            >
              {s.value}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="lp-analytics-chart-panel"
        initial={reduce ? false : { opacity: 0, y: 14 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ ...viewReplay, amount: 0.25 }}
        transition={springSoft}
      >
        <div className="lp-analytics-chart-head">
          <span className="lp-analytics-chart-title">Revenue (12 months)</span>
          <span className="lp-analytics-chart-pill">Live</span>
        </div>

        <div className="lp-analytics-area-wrap">
          <div className="lp-analytics-grid-bg" aria-hidden />
          <svg
            className="lp-analytics-area-svg"
            viewBox={`0 0 ${CHART_W} ${CHART_H + 8}`}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden
          >
            <defs>
              <linearGradient id="lp-showcase-area-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--lp-accent)" stopOpacity="0.35" />
                <stop offset="100%" stopColor="var(--lp-gradient-end)" stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="lp-showcase-line-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--lp-accent)" />
                <stop offset="100%" stopColor="var(--lp-gradient-end)" />
              </linearGradient>
              <filter id="lp-showcase-line-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.2" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Orbit / planetarium accents */}
            <g className="lp-analytics-orbit-decor" opacity="0.35">
              <ellipse cx="320" cy="36" rx="48" ry="22" fill="none" stroke="var(--lp-border-warm)" strokeWidth="0.6" />
              <ellipse cx="320" cy="36" rx="62" ry="28" fill="none" stroke="var(--lp-accent)" strokeWidth="0.45" strokeDasharray="3 6" opacity="0.6" />
              <circle cx="368" cy="36" r="3" fill="var(--lp-gradient-end)" />
              <circle cx="280" cy="44" r="2" fill="var(--lp-accent)" />
            </g>

            <motion.path
              d={areaD}
              fill="url(#lp-showcase-area-fill)"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={viewReplay}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
            <motion.path
              d={lineD}
              fill="none"
              stroke="url(#lp-showcase-line-stroke)"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#lp-showcase-line-glow)"
              initial={{ pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0.4 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={viewReplay}
              transition={{ pathLength: { duration: 1.35, ease: [0.25, 0.46, 0.45, 0.94] }, opacity: { duration: 0.4 } }}
            />
            {POINTS.map(([x, y], i) => (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r={3.2}
                fill="var(--lp-surface)"
                stroke="var(--lp-accent)"
                strokeWidth="1.4"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={viewReplay}
                transition={{ delay: reduce ? 0 : 0.04 * i + 0.45, duration: 0.25 }}
              />
            ))}
          </svg>
        </div>

        <div className="lp-analytics-bars-wrap">
          <div className="lp-analytics-bars-label">Pipeline velocity · last 12 weeks</div>
          <div className="lp-chart-bars lp-chart-bars--showcase">
            {BAR_HEIGHTS.map((h, i) => (
              <motion.div
                key={i}
                className="lp-chart-bar"
                initial={reduce ? false : { scaleY: 0 }}
                whileInView={reduce ? undefined : { scaleY: 1 }}
                viewport={{ ...viewReplay, amount: 0.5 }}
                transition={{ delay: reduce ? 0 : 0.035 * i, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  height: `${h}%`,
                  transformOrigin: 'bottom',
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
