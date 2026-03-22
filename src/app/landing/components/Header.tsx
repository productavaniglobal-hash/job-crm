'use client'

import { useState, useEffect } from 'react'

export default function Header() {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    return (
        <header className="lp-header" style={{ opacity: scrolled ? 1 : 0.95 }}>
            <div className="lp-header-inner">
                <div className="lp-header-brand">
                    <a href="/" className="lp-logo">
                        Pipe<span>ro</span>
                    </a>
                    <span className="lp-header-tagline">Agentic AI CRM</span>
                </div>

                <nav className="lp-nav">
                    <a href="#features">Features</a>
                    <a href="#pricing">Pricing</a>
                    <a href="#why">Why Pipero</a>
                </nav>

                <div className="lp-header-cta">
                    <a href="https://calendly.com/krishnasuseel2001/pipero-io-demo" target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn-secondary lp-btn-sm">Book a Demo</a>
                    <a href="/login" className="lp-btn lp-btn-primary lp-btn-sm">Sign In</a>
                </div>
            </div>
        </header>
    )
}
