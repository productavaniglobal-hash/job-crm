'use client'

import { useState } from 'react'
import { Mail, PlugZap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function EngageSettingsClient({
  mailboxEmail,
  lastSyncedAt,
  watchExpiration,
  historyId,
}: {
  mailboxEmail?: string | null
  lastSyncedAt?: string | null
  watchExpiration?: string | null
  historyId?: string | null
}) {
  const [watching, setWatching] = useState(false)
  const [watchError, setWatchError] = useState('')

  const startWatch = async () => {
    setWatchError('')
    setWatching(true)
    try {
      const res = await fetch('/api/engage/gmail/watch/start', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to start Gmail watch')
      window.location.reload()
    } catch (error: unknown) {
      setWatchError(error instanceof Error ? error.message : 'Failed to start Gmail watch')
    } finally {
      setWatching(false)
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Engage Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-4 w-4" /> Gmail
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {mailboxEmail ? `Connected: ${mailboxEmail}` : 'Not connected'}
            </p>
            {mailboxEmail ? (
              <div className="text-xs text-muted-foreground space-y-1 rounded-xl border p-2">
                <p>Last synced: {lastSyncedAt ? new Date(lastSyncedAt).toLocaleString() : 'Never'}</p>
                <p>Watch expires: {watchExpiration ? new Date(watchExpiration).toLocaleString() : 'Not started'}</p>
                <p>History cursor: {historyId || '—'}</p>
              </div>
            ) : null}
            <Button
              asChild
              type="button"
              className="w-full"
            >
              <a href="/api/engage/gmail/connect?returnTo=/engage/settings">
                <PlugZap className="h-4 w-4 mr-2" />
                {mailboxEmail ? 'Reconnect Gmail' : 'Connect Gmail'}
              </a>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={startWatch}
              disabled={!mailboxEmail || watching}
            >
              {watching ? 'Starting watch...' : 'Start Gmail push watch'}
            </Button>
            {watchError ? <p className="text-xs text-red-500">{watchError}</p> : null}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2"><CardTitle>Outlook</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">UI placeholder for Microsoft Graph integration.</p>
            <Button type="button" variant="outline" className="w-full" disabled>Connect Outlook</Button>
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader className="pb-2"><CardTitle>SMTP</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">UI placeholder for custom SMTP provider setup.</p>
            <Button type="button" variant="outline" className="w-full" disabled>Configure SMTP</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

