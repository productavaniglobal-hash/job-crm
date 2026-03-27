'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { heroEntrance, heroLine, heroMockup, springSnappy } from '../motion/variants'
import HeroSparkles from './HeroSparkles'

export default function HeroMotion() {
  const reduce = useReducedMotion()

  const mockup = (
    <div className="lp-mockup-shell">
      <HeroSparkles />
      <div className="lp-mockup">
        <div className="lp-mockup-frame">
          <div className="lp-mockup-bar">
            <span /><span /><span />
          </div>

          <div className="lp-mockup-content">
            <div className="lp-mockup-card">
              <div className="lp-mockup-card-label">Revenue</div>
              <div className="lp-mockup-card-value lp-gradient-text">$284K</div>
            </div>
            <div className="lp-mockup-card">
              <div className="lp-mockup-card-label">Close Rate</div>
              <div className="lp-mockup-card-value lp-stat-positive">68%</div>
            </div>

            <div className="lp-mockup-pipeline">
              <div className="lp-mockup-card-label">Deal Pipeline</div>
              <div className="lp-pipeline-scroll">
                <div className="lp-pipeline-cols">
                  <div className="lp-pipeline-col">
                    <div className="lp-pipeline-col-label">New</div>
                    <div className="lp-pipeline-item">Acme Corp</div>
                    <div className="lp-pipeline-item">TechFlow</div>
                  </div>
                  <div className="lp-pipeline-col">
                    <div className="lp-pipeline-col-label">Qualified</div>
                    <div className="lp-pipeline-item">Zenith AI</div>
                  </div>
                  <div className="lp-pipeline-col">
                    <div className="lp-pipeline-col-label">Proposal</div>
                    <div className="lp-pipeline-item">DataSync</div>
                    <div className="lp-pipeline-item">CloudNine</div>
                  </div>
                  <div className="lp-pipeline-col">
                    <div className="lp-pipeline-col-label">Won</div>
                    <div className="lp-pipeline-item" style={{ borderColor: 'rgba(34,197,94,0.3)' }}>Bolt Inc ✓</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lp-mockup-ai">
              <span className="lp-ai-dot" />
              <span>CRM agent: 3-step follow-up for Acme Corp — draft ready · step 2/3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (reduce) {
    return (
      <div className="lp-container">
        <div className="lp-hero-content">
          <div>
            <p className="lp-hero-badge lp-hero-badge--premium">Agentic AI CRM</p>
            <h1>
              Where AI agents
              <br />
              <span className="lp-gradient-text">run your pipeline.</span>
            </h1>
            <p className="lp-hero-sub">
              Pipero is the CRM where autonomous agents plan next steps, queue follow-ups,
              and keep full context on every lead and deal—so reps sell instead of
              fighting the tool.
            </p>
            <div className="lp-hero-ctas">
              <a href="/login" className="lp-btn lp-btn-primary">
                Get Started
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
              <a href="https://calendly.com/krishnasuseel2001/pipero-io-demo" target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn-secondary">
                Book a Demo
              </a>
            </div>
            <div className="lp-hero-trust">
              <div className="lp-hero-trust-dots">
                <span className="lp-hero-trust-dot" />
              </div>
              <span>No credit card required · Free 14-day trial</span>
            </div>
          </div>
          {mockup}
        </div>
      </div>
    )
  }

  return (
    <div className="lp-container">
      <div className="lp-hero-content">
        <motion.div variants={heroEntrance} initial="hidden" animate="visible">
          <motion.div variants={heroLine}>
            <p className="lp-hero-badge lp-hero-badge--premium">Agentic AI CRM</p>
          </motion.div>
          <motion.h1 className="lp-hero-title" variants={heroLine}>
            <span className="lp-hero-title-line">Where AI agents</span>
            <span className="lp-hero-title-line lp-gradient-text">run your pipeline.</span>
          </motion.h1>
          <motion.p className="lp-hero-sub" variants={heroLine}>
            Pipero is the CRM where autonomous agents plan next steps, queue follow-ups,
            and keep full context on every lead and deal—so reps sell instead of
            fighting the tool.
          </motion.p>
          <motion.div className="lp-hero-ctas" variants={heroLine}>
            <motion.a
              href="/login"
              className="lp-btn lp-btn-primary"
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={springSnappy}
            >
              Get Started
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </motion.a>
            <motion.a
              href="https://calendly.com/krishnasuseel2001/pipero-io-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="lp-btn lp-btn-secondary"
              whileHover={{ y: -2, scale: 1.015 }}
              whileTap={{ scale: 0.99 }}
              transition={springSnappy}
            >
              Book a Demo
            </motion.a>
          </motion.div>
          <motion.div className="lp-hero-trust" variants={heroLine}>
            <div className="lp-hero-trust-dots">
              <span className="lp-hero-trust-dot" />
            </div>
            <span>No credit card required · Free 14-day trial</span>
          </motion.div>
        </motion.div>

        <motion.div variants={heroMockup} initial="hidden" animate="visible">
          {mockup}
        </motion.div>
      </div>
    </div>
  )
}
