'use client'

import { useState, useEffect, useCallback } from 'react'

export default function Header() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const closeMenu = useCallback(() => setMenuOpen(false), [])

    useEffect(() => {
        if (!menuOpen) return
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeMenu()
        }
        window.addEventListener('keydown', onKey)
        return () => {
            document.body.style.overflow = prev
            window.removeEventListener('keydown', onKey)
        }
    }, [menuOpen, closeMenu])

    return (
        <header className="lp-header" style={{ opacity: scrolled ? 1 : 0.95 }}>
            <div className={`lp-header-inner${scrolled ? ' lp-header-inner--scrolled' : ''}`}>
                <div className="lp-header-brand">
                    <a href="/" className="lp-logo">
                        Pipe<span>ro</span>
                    </a>
                    <span className="lp-header-tagline">Agentic AI CRM</span>
                </div>

                <nav className="lp-nav lp-nav--desktop" aria-label="Main">
                    <a href="#features">Features</a>
                    <a href="#pricing">Pricing</a>
                    <a href="#why">Why Pipero</a>
                </nav>

                <div className="lp-header-actions">
                    <div className="lp-header-cta">
                        <a
                            href="https://calendly.com/krishnasuseel2001/pipero-io-demo"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="lp-btn lp-btn-secondary lp-btn-sm lp-header-demo"
                        >
                            Book a Demo
                        </a>
                        <a href="/login" className="lp-btn lp-btn-primary lp-btn-sm">
                            Sign In
                        </a>
                    </div>

                    <button
                        type="button"
                        className="lp-menu-toggle"
                        aria-expanded={menuOpen}
                        aria-controls="lp-mobile-menu"
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        onClick={() => setMenuOpen((o) => !o)}
                    >
                        {menuOpen ? (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                                <path d="M3 12h18M3 6h18M3 18h18" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {menuOpen && (
                <>
                    <div className="lp-mobile-backdrop" onClick={closeMenu} aria-hidden />
                    <div
                        id="lp-mobile-menu"
                        className="lp-mobile-drawer"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Site navigation"
                    >
                        <nav className="lp-mobile-nav" aria-label="Main">
                            <a href="#features" onClick={closeMenu}>
                                Features
                            </a>
                            <a href="#pricing" onClick={closeMenu}>
                                Pricing
                            </a>
                            <a href="#why" onClick={closeMenu}>
                                Why Pipero
                            </a>
                        </nav>
                        <a
                            href="https://calendly.com/krishnasuseel2001/pipero-io-demo"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="lp-btn lp-btn-secondary lp-mobile-nav-cta"
                            onClick={closeMenu}
                        >
                            Book a Demo
                        </a>
                    </div>
                </>
            )}
        </header>
    )
}
