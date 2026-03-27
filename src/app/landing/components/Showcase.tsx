'use client'

import { Children } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { staggerContainer, staggerItem } from '../motion/variants'
import { FadeIn } from './motion/FadeIn'
import { ScrollReveal } from './motion/ScrollReveal'
import ShowcaseAnalyticsMock from './ShowcaseAnalyticsMock'

/** Nested showcase mocks replay when scrolled out and back in. */
const viewReplay = { once: false as const }

/** Text column slides from alternating sides; mockup “pops” on scroll. */
function ShowcaseRow({ rowIndex, children }: { rowIndex: number; children: React.ReactNode }) {
    const arr = Children.toArray(children)
    const reduce = useReducedMotion()
    const textVariant = reduce ? 'fadeUp' : rowIndex % 2 === 0 ? 'slideLeft' : 'slideRight'
    const mockupVariant = reduce ? 'fadeUp' : 'pop'

    if (arr.length < 2) {
        return <div className="lp-showcase-item">{children}</div>
    }

    return (
        <div className="lp-showcase-item">
            <ScrollReveal variant={textVariant} amount={0.2}>
                {arr[0]}
            </ScrollReveal>
            <ScrollReveal variant={mockupVariant} amount={0.14} className="lp-showcase-mockup-wrap">
                {arr[1]}
            </ScrollReveal>
        </div>
    )
}

const KANBAN_COLS = [
    {
        title: 'New Leads',
        items: [
            { name: 'Acme Corp', sub: '$45K · Sarah R.' },
            { name: 'TechFlow', sub: '$28K · Mike J.' },
        ],
    },
    {
        title: 'Qualified',
        items: [{ name: 'Zenith AI', sub: '$120K · Lisa M.' }],
    },
    {
        title: 'Proposal',
        items: [
            { name: 'DataSync', sub: '$85K · Tom W.' },
            { name: 'CloudNine', sub: '$62K · Ana P.' },
        ],
    },
    {
        title: 'Closed Won ✓',
        items: [{ name: 'Bolt Inc', sub: '$156K · James K.', highlight: true }],
    },
] as const

const LEAD_TIMELINE = [
    { time: '2h ago', action: '📧 Email opened: "Q4 Pricing Proposal"' },
    { time: '1d ago', action: '📞 Call logged: 12 min · Discussed implementation' },
    { time: '3d ago', action: '🤖 AI: Lead score increased to 92/100' },
    { time: '5d ago', action: '📄 Proposal sent: $45,000 annual deal' },
] as const

const AUTOMATION_STEPS = [
    { label: 'TRIGGER', text: 'New lead from website', color: 'rgba(99,102,241,0.12)', border: 'rgba(99,102,241,0.25)' },
    { label: 'CONDITION', text: 'Score > 80 AND Source = "Inbound"', color: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.25)' },
    { label: 'ACTION', text: 'Assign to top rep + Send welcome email', color: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)' },
    { label: 'ACTION', text: 'Create follow-up task in 2 days', color: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)' },
] as const

export default function Showcase() {
    return (
        <section className="lp-section">
            <div className="lp-container">
                <FadeIn premium slide="left">
                    <div style={{ textAlign: 'center' }}>
                        <p className="lp-section-label">Product</p>
                        <h2 className="lp-section-title">See It in Action</h2>
                        <p className="lp-section-subtitle" style={{ margin: '0 auto' }}>
                            Every view is built for speed—and for agents to read CRM context and queue the next action without breaking your team&apos;s flow.
                        </p>
                    </div>
                </FadeIn>

                <div className="lp-showcase-items">
                    {/* Kanban Pipeline */}
                    <ShowcaseRow rowIndex={0}>
                        <div>
                            <span className="lp-showcase-label">Pipeline View</span>
                            <h3>Drag. Drop. Close.</h3>
                            <p>
                                Visualize every deal across stages. Move cards with a gesture,
                                update status instantly, and never lose track of where a deal stands.
                            </p>
                        </div>
                        <div className="lp-showcase-mockup">
                            <div className="lp-showcase-mockup-content">
                                <motion.div
                                    className="lp-kanban-mock"
                                    variants={staggerContainer}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ ...viewReplay, amount: 0.2 }}
                                >
                                    {KANBAN_COLS.map((col) => (
                                        <motion.div key={col.title} className="lp-kanban-col" variants={staggerItem}>
                                            <div className="lp-kanban-col-title">{col.title}</div>
                                            {col.items.map((it) => (
                                                <div
                                                    key={it.name}
                                                    className="lp-kanban-item"
                                                    style={
                                                        'highlight' in it && it.highlight
                                                            ? { borderColor: 'rgba(34,197,94,0.3)' }
                                                            : undefined
                                                    }
                                                >
                                                    {it.name}
                                                    <div className="lp-kanban-item-sub">{it.sub}</div>
                                                </div>
                                            ))}
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </ShowcaseRow>

                    {/* Analytics Dashboard */}
                    <ShowcaseRow rowIndex={1}>
                        <div>
                            <span className="lp-showcase-label">Analytics</span>
                            <h3>Data That Drives Decisions</h3>
                            <p>
                                Real-time dashboards that show what matters. Revenue trends,
                                rep performance, and pipeline health — all in one view.
                            </p>
                        </div>
                        <div className="lp-showcase-mockup">
                            <div className="lp-showcase-mockup-content lp-showcase-mockup-content--analytics">
                                <ShowcaseAnalyticsMock />
                            </div>
                        </div>
                    </ShowcaseRow>

                    {/* Lead Detail */}
                    <ShowcaseRow rowIndex={2}>
                        <div>
                            <span className="lp-showcase-label">Lead Detail</span>
                            <h3>360° Lead Intelligence</h3>
                            <p>
                                Every touchpoint, email, call, and note — all in one timeline.
                                AI enrichment fills in the gaps so your reps sell, not research.
                            </p>
                        </div>
                        <div className="lp-showcase-mockup">
                            <motion.div
                                className="lp-showcase-mockup-content lp-showcase-lead-mock"
                                style={{ gap: '10px' }}
                                variants={staggerContainer}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ ...viewReplay, amount: 0.25 }}
                            >
                                <motion.div
                                    variants={staggerItem}
                                    style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '12px', background: 'var(--lp-bg)', borderRadius: '12px', border: '1px solid var(--lp-border)' }}
                                >
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, var(--lp-accent), var(--lp-gradient-end))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>AC</div>
                                    <div>
                                        <div style={{ fontWeight: 700, fontSize: 14 }}>Acme Corporation</div>
                                        <div style={{ fontSize: 11, color: 'var(--lp-text-muted)' }}>Sarah Rodriguez · VP Sales · San Francisco</div>
                                    </div>
                                </motion.div>
                                {LEAD_TIMELINE.map((item, i) => (
                                    <motion.div
                                        key={i}
                                        variants={staggerItem}
                                        style={{ display: 'flex', gap: '12px', fontSize: 12, padding: '8px 12px', background: 'var(--lp-bg)', borderRadius: '8px', border: '1px solid var(--lp-border)' }}
                                    >
                                        <span style={{ color: 'var(--lp-text-muted)', fontSize: 10, fontWeight: 600, minWidth: 42, flexShrink: 0 }}>{item.time}</span>
                                        <span style={{ fontWeight: 500 }}>{item.action}</span>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </div>
                    </ShowcaseRow>

                    {/* Automation Builder */}
                    <ShowcaseRow rowIndex={3}>
                        <div>
                            <span className="lp-showcase-label">Automations</span>
                            <h3>Set It. Forget It. Close.</h3>
                            <p>
                                Build trigger-action workflows visually. Lead comes in hot?
                                Auto-assign, auto-notify, auto-follow-up. Zero manual work.
                            </p>
                        </div>
                        <div className="lp-showcase-mockup">
                            <div className="lp-showcase-mockup-content" style={{ gap: 16, justifyContent: 'center', alignItems: 'center', minHeight: 320 }}>
                                <motion.div
                                    style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 320, margin: '0 auto' }}
                                    variants={staggerContainer}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ ...viewReplay, amount: 0.3 }}
                                >
                                    {AUTOMATION_STEPS.map((step, i) => (
                                        <motion.div key={`${step.label}-${i}`} variants={staggerItem} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                            <div style={{ background: step.color, border: `1px solid ${step.border}`, borderRadius: 10, padding: '10px 14px' }}>
                                                <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: '0.1em', color: 'var(--lp-text-muted)', marginBottom: 4 }}>{step.label}</div>
                                                <div style={{ fontSize: 12, fontWeight: 600 }}>{step.text}</div>
                                            </div>
                                            {i < AUTOMATION_STEPS.length - 1 && (
                                                <div style={{ display: 'flex', justifyContent: 'center', padding: '4px 0' }}>
                                                    <svg width="12" height="16" viewBox="0 0 12 16" fill="none" stroke="var(--lp-text-muted)" strokeWidth="1.5">
                                                        <path d="M6 0v12M2 8l4 4 4-4" />
                                                    </svg>
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </div>
                    </ShowcaseRow>
                </div>
            </div>
        </section>
    )
}
