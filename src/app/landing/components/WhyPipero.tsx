'use client'

import { FadeIn } from './motion/FadeIn'
import { Stagger, StaggerItem } from './motion/Stagger'

export default function WhyPipero() {
    return (
        <section id="why" className="lp-section" style={{ background: 'var(--lp-bg-alt)' }}>
            <div className="lp-container">
                <FadeIn premium slide="left">
                <div style={{ textAlign: 'center' }}>
                    <p className="lp-section-label">Differentiation</p>
                    <h2 className="lp-section-title">
                        Why <span className="lp-gradient-text">Pipero</span>?
                    </h2>
                </div>
                </FadeIn>

                <Stagger className="lp-pillars" variant="spring">
                    <StaggerItem hoverLift variant="spring">
                    <div className="lp-glass-card lp-pillar">
                        <div className="lp-pillar-icon">⚡</div>
                        <h3>Built for Speed</h3>
                        <p>
                            Sub-second page loads. Instant search. Real-time sync.
                            Your CRM should be faster than your reps — and it is.
                        </p>
                    </div>
                    </StaggerItem>

                    <StaggerItem hoverLift variant="spring">
                    <div className="lp-glass-card lp-pillar">
                        <div className="lp-pillar-icon">🤖</div>
                        <h3>Agentic AI, native to the CRM</h3>
                        <p>
                            Agents don&apos;t live in a sidebar—they run on leads, deals, and inboxes
                            inside Pipero. That&apos;s the difference between generic &ldquo;AI features&rdquo; and
                            a true agentic AI CRM.
                        </p>
                    </div>
                    </StaggerItem>

                    <StaggerItem hoverLift variant="spring">
                    <div className="lp-glass-card lp-pillar">
                        <div className="lp-pillar-icon">🧩</div>
                        <h3>Simple Setup. No Consultants.</h3>
                        <p>
                            Import your data, invite your team, and start selling
                            in under 15 minutes. No onboarding fees. No training required.
                        </p>
                    </div>
                    </StaggerItem>
                </Stagger>
            </div>
        </section>
    )
}
