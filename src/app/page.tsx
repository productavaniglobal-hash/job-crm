import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import './landing/landing.css'
import { landingMetadata } from './landing/metadata'

const fontLpSans = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-lp-sans",
    display: "swap",
});

const fontLpDisplay = Fraunces({
    subsets: ["latin"],
    variable: "--font-lp-display",
    display: "swap",
});
import LandingDecor from './landing/components/LandingDecor'
import Header from './landing/components/Header'
import Hero from './landing/components/Hero'
import SocialProof from './landing/components/SocialProof'
import Problem from './landing/components/Problem'
import Features from './landing/components/Features'
import Showcase from './landing/components/Showcase'
import WhyPipero from './landing/components/WhyPipero'
import Pricing from './landing/components/Pricing'
import Footer from './landing/components/Footer'

export const metadata: Metadata = landingMetadata

export default function LandingPage() {
    return (
        <div className={`lp-page ${fontLpSans.variable} ${fontLpDisplay.variable}`}>
            <LandingDecor />
            <Header />
            <Hero />
            <SocialProof />
            <Problem />
            <Features />
            <Showcase />
            <WhyPipero />
            <Pricing />
            <Footer />
        </div>
    )
}
