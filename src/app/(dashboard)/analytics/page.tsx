import { getAnalytics } from '@/app/actions/crm'
import AnalyticsClient from '@/components/analytics/AnalyticsClient'

export default async function AnalyticsPage(props: { searchParams: Promise<{ days?: string }> }) {
    const searchParams = await props.searchParams
    const days = searchParams.days ? parseInt(searchParams.days) : 30
    const data = await getAnalytics(days)

    return <AnalyticsClient data={data} currentDays={days.toString()} />
}


