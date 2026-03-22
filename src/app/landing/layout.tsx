/**
 * Reserved for routes under `/landing/*`. Home `/` uses metadata from `src/app/page.tsx`
 * via `src/app/landing/metadata.ts`.
 */
export default function LandingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
