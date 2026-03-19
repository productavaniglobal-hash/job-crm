'use client'

import { useEffect, useRef, useState } from 'react'
import { Bold, Italic, List, Paperclip, Sparkles } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function ComposeModal({
  open,
  onOpenChange,
  seedTo,
  seedSubject,
  seedBodyHtml,
  onSent,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  seedTo?: string
  seedSubject?: string
  seedBodyHtml?: string
  onSent?: () => void
}) {
  const [to, setTo] = useState(seedTo || '')
  const [subject, setSubject] = useState(seedSubject || '')
  const [bodyHtml, setBodyHtml] = useState(seedBodyHtml || '<p>Hi {{name}},</p><p></p>')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const editorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) return
    if (seedTo) setTo(seedTo)
    if (seedSubject) setSubject(seedSubject)
    if (seedBodyHtml) setBodyHtml(seedBodyHtml)
  }, [open, seedTo, seedSubject, seedBodyHtml])

  useEffect(() => {
    if (!editorRef.current) return
    if (editorRef.current.innerHTML !== bodyHtml) {
      editorRef.current.innerHTML = bodyHtml
    }
  }, [bodyHtml])

  const insertVariable = (v: string) => {
    if (!editorRef.current) return
    editorRef.current.focus()
    document.execCommand('insertText', false, v)
    setBodyHtml(editorRef.current.innerHTML)
  }

  const runFormat = (cmd: 'bold' | 'italic' | 'insertUnorderedList') => {
    if (!editorRef.current) return
    editorRef.current.focus()
    document.execCommand(cmd)
    setBodyHtml(editorRef.current.innerHTML)
  }

  const send = async () => {
    setError('')
    setSending(true)
    try {
      const res = await fetch('/api/engage/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, bodyHtml }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Send failed')
      onOpenChange(false)
      onSent?.()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Send failed')
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Compose email</DialogTitle>
          <DialogDescription>UI-only attachments, Gmail-backed send.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="To" />
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Subject" />

          <div className="flex items-center gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => insertVariable('{{name}}')}>
              Insert {'{{name}}'}
            </Button>
            <Button type="button" size="sm" variant="outline" onClick={() => insertVariable('{{company}}')}>
              Insert {'{{company}}'}
            </Button>
            <Button type="button" size="sm" variant="outline" disabled>
              <Paperclip className="h-4 w-4 mr-2" />
              Attachments (UI)
            </Button>
            <Button type="button" size="sm" variant="outline" disabled>
              <Sparkles className="h-4 w-4 mr-2" />
              AI Generate
            </Button>
          </div>

          <div className="rounded-xl border p-2 space-y-2">
            <div className="flex items-center gap-1 border-b pb-2">
              <Button type="button" size="sm" variant="ghost" onClick={() => runFormat('bold')}><Bold className="h-4 w-4" /></Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => runFormat('italic')}><Italic className="h-4 w-4" /></Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => runFormat('insertUnorderedList')}><List className="h-4 w-4" /></Button>
            </div>
            <div
              ref={editorRef}
              contentEditable
              onInput={(e) => setBodyHtml((e.target as HTMLDivElement).innerHTML)}
              className="min-h-56 outline-none text-sm"
              suppressContentEditableWarning
            />
          </div>
          {error ? <p className="text-xs text-red-500">{error}</p> : null}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={send} disabled={sending || !to || !subject || !bodyHtml}>
            {sending ? 'Sending...' : 'Send email'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

