'use client'

import { useEffect, useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { EngageTemplate } from '@/types/engage'
import { upsertEngageTemplate } from '@/app/actions/engage'
import { createClient as createSupabaseClient } from '@/lib/supabase/client'

export default function TemplatesClient({ initialTemplates }: { initialTemplates: EngageTemplate[] }) {
  const [templates, setTemplates] = useState(initialTemplates)
  const [activeId, setActiveId] = useState(initialTemplates[0]?.id || '')
  const [name, setName] = useState(initialTemplates[0]?.name || '')
  const [subject, setSubject] = useState(initialTemplates[0]?.subject || '')
  const [body, setBody] = useState(initialTemplates[0]?.body || '')
  const [pending, startTransition] = useTransition()
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    const supabase = createSupabaseClient()
    const channel = supabase
      .channel('engage-templates-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'engage_templates' }, async () => {
        setSyncing(true)
        try {
          const res = await fetch('/api/engage/templates', { cache: 'no-store' })
          const data = await res.json()
          if (res.ok && Array.isArray(data?.templates)) {
            setTemplates(data.templates)
            if (!activeId && data.templates[0]) {
              const first = data.templates[0] as EngageTemplate
              setActiveId(first.id)
              setName(first.name)
              setSubject(first.subject)
              setBody(first.body)
            }
          }
        } finally {
          setSyncing(false)
        }
      })
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeId])

  const select = (tpl: EngageTemplate) => {
    setActiveId(tpl.id)
    setName(tpl.name)
    setSubject(tpl.subject)
    setBody(tpl.body)
  }

  const createNew = () => {
    setActiveId('')
    setName('')
    setSubject('')
    setBody('Hi {{name}},\n')
  }

  const save = () => {
    const id = activeId || `local-${Date.now()}`
    const updated: EngageTemplate = { id, name, subject, body, updatedAt: new Date().toISOString() }
    setTemplates((prev) => [updated, ...prev.filter((p) => p.id !== id)])
    setActiveId(id)
    startTransition(async () => {
      try {
        await upsertEngageTemplate({ id, name, subject, body })
      } catch {
        // local-first UX
      }
    })
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)] gap-4">
      <Card className="rounded-2xl">
        <CardHeader className="pb-2 flex-row items-center justify-between">
          <CardTitle>Templates {syncing ? <span className="text-xs text-muted-foreground">(syncing...)</span> : null}</CardTitle>
          <Button type="button" size="sm" onClick={createNew}>New</Button>
        </CardHeader>
        <CardContent className="space-y-2">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => select(t)}
              className={`w-full text-left rounded-xl border p-3 ${activeId === t.id ? 'bg-blue-500/10 border-blue-500/30' : 'hover:bg-accent/40'}`}
            >
              <p className="font-medium truncate">{t.name}</p>
              <p className="text-xs text-muted-foreground truncate">{t.subject}</p>
            </button>
          ))}
          {!templates.length ? <p className="text-sm text-muted-foreground">No templates yet.</p> : null}
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader className="pb-2"><CardTitle>Template Editor</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Template name" />
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />
          <Textarea value={body} onChange={(e) => setBody(e.target.value)} className="min-h-60" placeholder="Body (supports {{name}}, {{company}})" />
          <div className="flex items-center gap-2">
            <Button type="button" onClick={save} disabled={pending || !name || !subject}>
              {pending ? 'Saving...' : 'Save template'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setBody((v) => `${v}\n{{name}}`)}>
              Insert {'{{name}}'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setBody((v) => `${v}\n{{company}}`)}>
              Insert {'{{company}}'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

