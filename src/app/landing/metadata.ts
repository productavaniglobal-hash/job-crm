import type { Metadata } from "next";

/** Single source of truth for `/` landing SEO (imported from `src/app/page.tsx`). */
export const landingMetadata: Metadata = {
    title:
        "Pipero.io — Agentic AI CRM | AI Agents Inside Your Sales CRM",
    description:
        "Pipero is the agentic AI CRM: autonomous AI agents plan next steps, run follow-ups, and route leads—inside your CRM records, not in another tool.",
    keywords: [
        "CRM",
        "agentic AI",
        "agentic CRM",
        "AI CRM",
        "sales CRM",
        "AI agents",
        "small business CRM",
        "pipeline management",
        "sales automation",
        "deal tracking",
    ],
    openGraph: {
        title: "Pipero.io — Agentic AI CRM",
        description:
            "The CRM where AI agents work your pipeline: context on every lead, actions queued in the CRM, less manual logging.",
        type: "website",
        url: "https://pipero.io",
        siteName: "Pipero.io",
    },
    twitter: {
        card: "summary_large_image",
        title: "Pipero.io — Agentic AI CRM",
        description:
            "Autonomous AI agents inside your CRM—pipeline, leads, and deals in one place.",
    },
    robots: "index, follow",
};
