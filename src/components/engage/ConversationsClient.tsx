'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MOCK_ENGAGE_LEADS } from '@/mock/engage'

export default function ConversationsClient() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Conversations</h1>
      <div className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)] gap-4">
        <Card className="rounded-2xl">
          <CardHeader className="pb-2"><CardTitle>Conversation list</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {MOCK_ENGAGE_LEADS.map((lead, i) => (
              <div key={lead.id} className={`rounded-xl border p-3 ${i === 0 ? 'bg-blue-500/10 border-blue-500/30' : ''}`}>
                <p className="font-medium">{lead.name}</p>
                <p className="text-xs text-muted-foreground">{lead.email}</p>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardHeader className="pb-2"><CardTitle>Unified thread</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="rounded-xl border p-3">Email touchpoint: Intro sent 2 days ago.</div>
            <div className="rounded-xl border p-3">Reply received: Interested, asked for pricing.</div>
            <div className="rounded-xl border p-3">Next action: Schedule follow-up email + call.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

