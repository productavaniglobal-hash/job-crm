import { getContentDetail } from '@/app/actions/content-intelligence'
import ContentDetailClient from '@/components/content/ContentDetailClient'
import { MOCK_CONTENT_LIBRARY } from '@/mock/content-library'

export default async function ContentDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const detail = await getContentDetail(params.id)
  if (detail) return <ContentDetailClient detail={detail as any} />

  const mock = MOCK_CONTENT_LIBRARY.find((m) => m.id === params.id)
  if (mock) {
    const mockDetail = {
      content: mock,
      versions: [
        {
          id: `${mock.id}-v1`,
          version: mock.current_version || 1,
          title: mock.title,
          description: mock.description,
          content_body: mock.content_body,
          tags: mock.tags,
          persona: mock.persona,
          industry: mock.industry,
          created_at: mock.updated_at,
          change_summary: 'Sample content version',
        },
      ],
      usage_summary: {
        executed: Number(mock.performance_metrics?.usage_count || 0),
        opened: Number(mock.performance_metrics?.opened || 0),
        replied: Number(mock.performance_metrics?.replied || 0),
        converted: Number(mock.performance_metrics?.converted || 0),
      },
    }
    return <ContentDetailClient detail={mockDetail as any} isMock />
  }

  return (
    <div className="flex flex-col items-center justify-center h-[50vh] space-y-2">
      <h1 className="text-xl font-semibold">Content not found</h1>
      <p className="text-sm text-muted-foreground">It may have been deleted or you don’t have access.</p>
    </div>
  )
}

