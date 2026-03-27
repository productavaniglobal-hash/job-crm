/**
 * Solar-system / orbit / planetarium-inspired hero graphics (decorative only).
 */
export default function HeroCosmicDecor() {
    return (
        <div className="lp-hero-cosmos-wrap" aria-hidden>
            <svg className="lp-hero-cosmos-svg" viewBox="0 0 420 320" preserveAspectRatio="xMidYMid meet">
                <defs>
                    <radialGradient id="lp-cosmos-sun" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="var(--lp-accent)" stopOpacity="0.95" />
                        <stop offset="55%" stopColor="var(--lp-gradient-end)" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="var(--lp-gradient-end)" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="lp-cosmos-orbit" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="var(--lp-accent)" stopOpacity="0" />
                        <stop offset="50%" stopColor="var(--lp-accent)" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="var(--lp-gradient-end)" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="lp-cosmos-dome" x1="0%" y1="100%" x2="0%" y2="0%">
                        <stop offset="0%" stopColor="var(--lp-accent)" stopOpacity="0.08" />
                        <stop offset="100%" stopColor="var(--lp-accent)" stopOpacity="0.28" />
                    </linearGradient>
                </defs>

                {/* Distant galaxy arc (hint) */}
                <path
                    className="lp-cosmos-galaxy-arc"
                    d="M 8 52 C 72 28 128 36 188 48 S 312 72 380 44"
                    fill="none"
                    stroke="url(#lp-cosmos-orbit)"
                    strokeWidth="0.85"
                    opacity="0.45"
                />

                {/* Planetarium dome silhouette (horizon + meridian) */}
                <path
                    className="lp-cosmos-dome"
                    d="M 96 268 A 114 114 0 0 1 324 268"
                    fill="none"
                    stroke="url(#lp-cosmos-dome)"
                    strokeWidth="1.1"
                    strokeLinecap="round"
                    opacity="0.55"
                />
                <path
                    className="lp-cosmos-dome"
                    d="M 210 154 L 210 268"
                    fill="none"
                    stroke="url(#lp-cosmos-dome)"
                    strokeWidth="0.6"
                    opacity="0.35"
                />

                {/* Solar system: sun + elliptical orbits + planets */}
                <g className="lp-cosmos-system">
                    <ellipse
                        cx="278"
                        cy="118"
                        rx="132"
                        ry="72"
                        fill="none"
                        stroke="var(--lp-border-warm)"
                        strokeWidth="0.7"
                        opacity="0.35"
                        transform="rotate(-10 278 118)"
                    />
                    <ellipse
                        cx="278"
                        cy="118"
                        rx="98"
                        ry="54"
                        fill="none"
                        stroke="url(#lp-cosmos-orbit)"
                        strokeWidth="0.9"
                        strokeDasharray="4 8"
                        opacity="0.5"
                        transform="rotate(-10 278 118)"
                    />
                    <ellipse
                        cx="278"
                        cy="118"
                        rx="64"
                        ry="36"
                        fill="none"
                        stroke="url(#lp-cosmos-orbit)"
                        strokeWidth="0.75"
                        strokeDasharray="3 6"
                        opacity="0.55"
                        transform="rotate(-10 278 118)"
                    />

                    <circle cx="278" cy="118" r="9" fill="url(#lp-cosmos-sun)" className="lp-cosmos-sun" />

                    <g className="lp-cosmos-spin lp-cosmos-spin--a">
                        <circle cx="352" cy="118" r="4.5" fill="var(--lp-gradient-end)" opacity="0.85" />
                    </g>
                    <g className="lp-cosmos-spin lp-cosmos-spin--b">
                        <circle cx="320" cy="88" r="3.5" fill="var(--lp-accent)" opacity="0.75" />
                    </g>
                    <g className="lp-cosmos-spin lp-cosmos-spin--c">
                        <circle cx="240" cy="142" r="3" fill="var(--lp-text-muted)" opacity="0.55" />
                    </g>
                </g>

                {/* Secondary orbit trail (comet-style) */}
                <path
                    className="lp-cosmos-trail"
                    d="M 32 220 C 120 180 200 200 288 128"
                    fill="none"
                    stroke="url(#lp-cosmos-orbit)"
                    strokeWidth="0.9"
                    strokeLinecap="round"
                    opacity="0.4"
                />
            </svg>
        </div>
    )
}
