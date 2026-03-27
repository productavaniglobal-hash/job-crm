import HeroCosmicDecor from './HeroCosmicDecor'
import HeroMotion from './HeroMotion'

export default function Hero() {
    return (
        <section className="lp-hero">
            <div className="lp-hero-decor" aria-hidden>
                <HeroCosmicDecor />
            </div>
            <HeroMotion />
        </section>
    )
}
