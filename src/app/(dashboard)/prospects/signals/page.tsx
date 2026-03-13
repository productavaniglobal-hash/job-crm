'use client'

import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { MOCK_SIGNALS } from '@/mock/signals'

const INITIAL_ENABLED: Record<string, boolean> = {
  funding: true,
  product: false,
  acquisition: true,
  awards: false,
  partnership: false,
  layoffs: false,
  expansion: false,
  'key-hire': false,
  keywords: true,
}

export default function SignalsPage() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(INITIAL_ENABLED)

  const toggle = (id: string) => {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Signal Type</h1>
        <p className="text-muted-foreground text-sm mt-1">Select the type of signal you want to track.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MOCK_SIGNALS.map((signal) => (
          <Card
            key={signal.id}
            className="rounded-xl border bg-card shadow-sm flex flex-col"
          >
            <CardHeader className="pb-2 flex flex-row items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base leading-tight">{signal.title}</CardTitle>
                <CardDescription className="text-sm mt-1.5">{signal.description}</CardDescription>
              </div>
              <Switch
                checked={!!enabled[signal.id]}
                onCheckedChange={() => toggle(signal.id)}
                className="shrink-0"
              />
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  )
}
