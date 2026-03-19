'use client'

import { useEffect, useState, useTransition } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { EngageSequence, EngageTemplate } from '@/types/engage'
import { createEngageSequence } from '@/app/actions/engage'
import { createClient as createSupabaseClient } from '@/lib/supabase/client'

type DraftStep = { id: string; templateId: string; delayDays: number }

export default function SequenceBuilder({
  initialSequences,
  templates,
}: {
  initialSequences: EngageSequence[]
  templates: EngageTemplate[]
}) {
  const [sequences, setSequences] = useState(initialSequences)
  const [name, setName] = useState('')
  const [steps, setSteps] = useState<DraftStep[]>([{ id: 's-initial', templateId: '', delayDays: 1 }])
  const [pending, startTransition] = useTransition()
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    const supabase = createSupabaseClient()
    const channel = supabase
      .channel('engage-sequences-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'engage_sequences' }, async () => {
        setSyncing(true)
        try {
          const res = await fetch('/api/engage/sequences', { cache: 'no-store' })
          const data = await res.json()
          if (res.ok && Array.isArray(data?.sequences)) {
            setSequences(data.sequences)
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

  const updateStep = (id: string, patch: Partial<DraftStep>) => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  const addStep = () => setSteps((prev) => [...prev, { id: `s-${Date.now()}-${prev.length}`, templateId: '', delayDays: 1 }])
  const removeStep = (id: string) => setSteps((prev) => prev.filter((s) => s.id !== id))

  const createSequence = () => {
    const valid = steps.filter((s) => s.templateId)
    if (!name || !valid.length) return
    const next: EngageSequence = {
      id: `local-${Date.now()}`,
      name,
      steps: valid.map((s) => ({ id: s.id, templateId: s.templateId, delayDays: Number(s.delayDays) || 1 })),
    }
    setSequences((prev) => [next, ...prev])
    startTransition(async () => {
      try {
        await createEngageSequence({
          name: next.name,
          steps: next.steps,
        })
      } catch {
        // keep local state
      }
    })
    setName('')
    setSteps([{ id: 's-reset', templateId: '', delayDays: 1 }])
  }

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl">
        <CardHeader className="pb-2"><CardTitle>Create sequence</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Sequence name" />
          <div className="space-y-2">
            {steps.map((step, idx) => (
              <div key={step.id} className="rounded-xl border p-3 grid grid-cols-1 md:grid-cols-[1fr_140px_auto] gap-2 items-center">
                <Select value={step.templateId} onValueChange={(v) => updateStep(step.id, { templateId: v })}>
                  <SelectTrigger><SelectValue placeholder={`Step ${idx + 1} template`} /></SelectTrigger>
                  <SelectContent>
                    {templates.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min={0}
                  value={step.delayDays}
                  onChange={(e) => updateStep(step.id, { delayDays: Number(e.target.value) })}
                  placeholder="Delay days"
                />
                <Button type="button" variant="outline" onClick={() => removeStep(step.id)} disabled={steps.length <= 1}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={addStep}><Plus className="h-4 w-4 mr-2" />Add step</Button>
            <Button type="button" onClick={createSequence} disabled={pending || !name}>
              {pending ? 'Saving...' : 'Create sequence'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader className="pb-2"><CardTitle>Sequences {syncing ? <span className="text-xs text-muted-foreground">(syncing...)</span> : null}</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {sequences.map((s) => (
            <div key={s.id} className="rounded-xl border p-3">
              <p className="font-medium">{s.name}</p>
              <p className="text-xs text-muted-foreground">{s.steps.length} step(s)</p>
            </div>
          ))}
          {!sequences.length ? <p className="text-sm text-muted-foreground">No sequences yet.</p> : null}
        </CardContent>
      </Card>
    </div>
  )
}

