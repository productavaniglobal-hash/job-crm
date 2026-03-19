'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { EngageCampaign, EngageLead, EngageTemplate } from '@/types/engage'
import { createEngageCampaign } from '@/app/actions/engage'
import { createClient as createSupabaseClient } from '@/lib/supabase/client'

export default function CampaignBuilder({
  initialCampaigns,
  leads,
  templates,
}: {
  initialCampaigns: EngageCampaign[]
  leads: EngageLead[]
  templates: EngageTemplate[]
}) {
  const [campaigns, setCampaigns] = useState(initialCampaigns)
  const [name, setName] = useState('')
  const [templateId, setTemplateId] = useState('')
  const [scheduleAt, setScheduleAt] = useState('')
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([])
  const [status, setStatus] = useState<EngageCampaign['status']>('draft')
  const [pending, startTransition] = useTransition()
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    const supabase = createSupabaseClient()
    const channel = supabase
      .channel('engage-campaigns-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'engage_campaigns' }, async () => {
        setSyncing(true)
        try {
          const res = await fetch('/api/engage/campaigns', { cache: 'no-store' })
          const data = await res.json()
          if (res.ok && Array.isArray(data?.campaigns)) {
            setCampaigns(data.campaigns)
          }
        } finally {
          setSyncing(false)
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const toggleLead = (id: string) => {
    setSelectedLeadIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  const templateName = useMemo(
    () => Object.fromEntries(templates.map((t) => [t.id, t.name])),
    [templates]
  )

  const createCampaign = () => {
    if (!name || !templateId || !selectedLeadIds.length || !scheduleAt) return
    const next: EngageCampaign = {
      id: `local-${Date.now()}`,
      name,
      audienceLeadIds: selectedLeadIds,
      templateId,
      scheduleAt: new Date(scheduleAt).toISOString(),
      status,
    }
    setCampaigns((prev) => [next, ...prev])
    startTransition(async () => {
      try {
        await createEngageCampaign({
          name: next.name,
          audienceLeadIds: next.audienceLeadIds,
          templateId: next.templateId,
          scheduleAt: next.scheduleAt,
          status: next.status,
        })
      } catch {
        // keep local row for UX continuity
      }
    })
    setName('')
    setTemplateId('')
    setSelectedLeadIds([])
  }

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle>Create campaign</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Campaign name" />
          <Select value={templateId} onValueChange={setTemplateId}>
            <SelectTrigger><SelectValue placeholder="Select template" /></SelectTrigger>
            <SelectContent>
              {templates.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input type="datetime-local" value={scheduleAt} onChange={(e) => setScheduleAt(e.target.value)} />
          <Select value={status} onValueChange={(v) => setStatus(v as EngageCampaign['status'])}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>

          <div className="rounded-xl border p-3">
            <p className="text-sm font-medium mb-2">Audience</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {leads.map((l) => (
                <label key={l.id} className="text-sm flex items-center gap-2 rounded-lg border p-2">
                  <input type="checkbox" checked={selectedLeadIds.includes(l.id)} onChange={() => toggleLead(l.id)} />
                  <span>{l.name} <span className="text-muted-foreground">({l.company})</span></span>
                </label>
              ))}
            </div>
          </div>

          <Button type="button" onClick={createCampaign} disabled={pending || !name || !templateId || !selectedLeadIds.length || !scheduleAt}>
            {pending ? 'Saving...' : 'Create campaign'}
          </Button>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader className="pb-2">
          <CardTitle>Campaign list {syncing ? <span className="text-xs text-muted-foreground">(syncing...)</span> : null}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {campaigns.map((c) => (
            <div key={c.id} className="rounded-xl border p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">{c.name}</p>
                <span className="text-xs rounded-full border px-2 py-0.5">{c.status}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Audience: {c.audienceLeadIds.length} · Template: {templateName[c.templateId] || '—'} · {new Date(c.scheduleAt).toLocaleString()}
              </p>
            </div>
          ))}
          {!campaigns.length ? <p className="text-sm text-muted-foreground">No campaigns yet.</p> : null}
        </CardContent>
      </Card>
    </div>
  )
}

