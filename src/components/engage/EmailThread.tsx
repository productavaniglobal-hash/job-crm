'use client'

import type { EngageThread } from '@/types/engage'

export default function EmailThread({
  thread,
  loading,
}: {
  thread: EngageThread | null
  loading?: boolean
}) {
  if (loading) {
    return (
      <div className="h-full rounded-2xl border bg-card p-4 space-y-3 animate-pulse">
        <div className="h-5 bg-muted rounded w-2/3" />
        <div className="h-16 bg-muted rounded" />
        <div className="h-16 bg-muted rounded" />
      </div>
    )
  }

  if (!thread) {
    return (
      <div className="h-full rounded-2xl border bg-card grid place-items-center text-sm text-muted-foreground">
        Select an email thread
      </div>
    )
  }

  return (
    <div className="h-full rounded-2xl border bg-card overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold truncate">{thread.subject}</h2>
        <p className="text-xs text-muted-foreground">{thread.messages.length} message(s)</p>
      </div>

      <div className="p-4 space-y-3 overflow-auto h-[calc(100%-72px)]">
        {thread.messages.map((m) => (
          <div key={m.id} className="rounded-xl border p-3">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{m.from}</p>
                <p className="text-xs text-muted-foreground truncate">to {m.to}</p>
              </div>
              <span className="text-xs text-muted-foreground">{new Date(m.date).toLocaleString()}</span>
            </div>
            <div
              className="prose prose-sm dark:prose-invert max-w-none text-sm"
              dangerouslySetInnerHTML={{ __html: m.bodyHtml || `<pre>${m.bodyText}</pre>` }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

