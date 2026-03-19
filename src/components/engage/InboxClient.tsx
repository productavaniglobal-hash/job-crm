'use client'

import { useEffect, useMemo, useState } from 'react'
import { MailPlus, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import EmailList from '@/components/engage/EmailList'
import EmailThread from '@/components/engage/EmailThread'
import ComposeModal from '@/components/engage/ComposeModal'
import AIWriterPanel from '@/components/engage/AIWriterPanel'
import type { EngageEmailSummary, EngageThread } from '@/types/engage'
import { createClient as createSupabaseClient } from '@/lib/supabase/client'

type Mailbox = { email?: string } | null

export default function InboxClient({ mailbox }: { mailbox: Mailbox }) {
  const [mailboxEmail, setMailboxEmail] = useState(mailbox?.email || '')
  const [emails, setEmails] = useState<EngageEmailSummary[]>([])
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  const [thread, setThread] = useState<EngageThread | null>(null)
  const [loadingList, setLoadingList] = useState(false)
  const [loadingThread, setLoadingThread] = useState(false)
  const [search, setSearch] = useState('')
  const [unreadOnly, setUnreadOnly] = useState(false)
  const [starredOnly, setStarredOnly] = useState(false)
  const [composeOpen, setComposeOpen] = useState(false)
  const [seedSubject, setSeedSubject] = useState('')
  const [seedBody, setSeedBody] = useState('')
  const [error, setError] = useState('')

  const canUseInbox = Boolean(mailboxEmail)

  const loadInbox = async () => {
    if (!canUseInbox) return
    setError('')
    setLoadingList(true)
    try {
      const url = new URL('/api/engage/inbox', window.location.origin)
      if (search) url.searchParams.set('q', search)
      if (unreadOnly) url.searchParams.set('unread', 'true')
      if (starredOnly) url.searchParams.set('starred', 'true')
      const res = await fetch(url.toString())
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to load inbox')
      setEmails(data.emails || [])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load inbox')
    } finally {
      setLoadingList(false)
    }
  }

  const refreshMailbox = async () => {
    try {
      const res = await fetch('/api/engage/gmail/mailbox', { cache: 'no-store' })
      const data = await res.json()
      if (res.ok) {
        setMailboxEmail(data?.mailbox?.email || '')
      }
    } catch {
      // noop
    }
  }

  const loadThread = async (threadId: string) => {
    setLoadingThread(true)
    try {
      const res = await fetch(`/api/engage/inbox/${threadId}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Failed to load thread')
      setThread(data.thread || null)
    } catch {
      setThread(null)
    } finally {
      setLoadingThread(false)
    }
  }

  useEffect(() => {
    loadInbox()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canUseInbox, unreadOnly, starredOnly])

  useEffect(() => {
    if (!canUseInbox) return
    const t = window.setTimeout(() => {
      loadInbox()
    }, 300)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  useEffect(() => {
    if (!canUseInbox) return
    const timer = window.setInterval(() => {
      loadInbox()
      if (activeThreadId) loadThread(activeThreadId)
    }, 30000)
    return () => window.clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canUseInbox, activeThreadId, unreadOnly, starredOnly, search])

  useEffect(() => {
    const supabase = createSupabaseClient()
    const mailboxChannel = supabase
      .channel('engage-mailbox-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'engage_mailboxes' }, async () => {
        await refreshMailbox()
        if (!canUseInbox) return
        await loadInbox()
      })
      .subscribe()
    const emailsChannel = supabase
      .channel('engage-emails-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'engage_emails' }, async () => {
        if (!canUseInbox) return
        await loadInbox()
      })
      .subscribe()
    return () => {
      supabase.removeChannel(mailboxChannel)
      supabase.removeChannel(emailsChannel)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canUseInbox])

  const subtitle = useMemo(() => {
    if (!canUseInbox) return 'Connect Gmail in Engage Settings to view your inbox.'
    return mailboxEmail ? `Connected mailbox: ${mailboxEmail}` : ''
  }, [mailboxEmail, canUseInbox])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Engage Inbox</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={loadInbox} disabled={!canUseInbox || loadingList}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loadingList ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button type="button" onClick={() => setComposeOpen(true)} disabled={!canUseInbox}>
            <MailPlus className="h-4 w-4 mr-2" />
            Compose
          </Button>
        </div>
      </div>

      {error ? <p className="text-sm text-red-500">{error}</p> : null}

      <div className="grid grid-cols-1 xl:grid-cols-[360px_minmax(0,1fr)_320px] gap-4">
        <EmailList
          emails={emails}
          activeThreadId={activeThreadId}
          search={search}
          onSearchChange={setSearch}
          unreadOnly={unreadOnly}
          starredOnly={starredOnly}
          onToggleUnread={() => setUnreadOnly((v) => !v)}
          onToggleStarred={() => setStarredOnly((v) => !v)}
          onSelect={(email) => {
            setActiveThreadId(email.threadId)
            loadThread(email.threadId)
          }}
          loading={loadingList}
        />

        <EmailThread thread={thread} loading={loadingThread} />

        <AIWriterPanel
          onUse={(subject, bodyHtml) => {
            setSeedSubject(subject)
            setSeedBody(bodyHtml)
            setComposeOpen(true)
          }}
        />
      </div>

      <ComposeModal
        open={composeOpen}
        onOpenChange={setComposeOpen}
        seedSubject={seedSubject}
        seedBodyHtml={seedBody}
        onSent={loadInbox}
      />
    </div>
  )
}

