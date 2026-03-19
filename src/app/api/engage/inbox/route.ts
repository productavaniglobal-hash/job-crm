import { NextRequest, NextResponse } from 'next/server'
import { getGmailMailbox, getValidGmailAccessToken } from '@/app/actions/engage'
import { listInboxMessages } from '@/lib/gmail'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const mailbox = await getGmailMailbox()
    if (!mailbox) {
      return NextResponse.json({ emails: [] })
    }
    const q = req.nextUrl.searchParams.get('q') || ''
    const unread = req.nextUrl.searchParams.get('unread') === 'true'
    const starred = req.nextUrl.searchParams.get('starred') === 'true'

    let query = supabase
      .from('engage_emails')
      .select('*')
      .eq('mailbox_id', mailbox.id)
      .order('received_at', { ascending: false })
      .limit(100)

    if (unread) query = query.eq('unread', true)
    if (starred) query = query.eq('starred', true)
    if (q) query = query.or(`from_email.ilike.%${q}%,to_email.ilike.%${q}%,subject.ilike.%${q}%,snippet.ilike.%${q}%`)

    const { data, error } = await query
    if (!error && data && data.length > 0) {
      const emails = data.map((x) => ({
        id: String(x.gmail_message_id),
        threadId: String(x.gmail_thread_id),
        from: String(x.from_email ?? ''),
        to: String(x.to_email ?? ''),
        subject: String(x.subject ?? ''),
        snippet: String(x.snippet ?? ''),
        date: String(x.date_header ?? x.received_at ?? new Date().toISOString()),
        unread: Boolean(x.unread),
        starred: Boolean(x.starred),
      }))
      return NextResponse.json({ emails })
    }

    // Fallback to direct Gmail pull if DB is cold.
    const accessToken = await getValidGmailAccessToken()
    const emails = await listInboxMessages(accessToken, { q, unread, starred })
    if (emails.length > 0) {
      const rows = emails.map((e) => ({
        mailbox_id: mailbox.id,
        organization_id: mailbox.organization_id,
        user_id: mailbox.user_id,
        gmail_message_id: e.id,
        gmail_thread_id: e.threadId,
        from_email: e.from,
        to_email: e.to ?? '',
        subject: e.subject,
        snippet: e.snippet,
        date_header: e.date,
        received_at: new Date(e.date).toString() === 'Invalid Date' ? new Date().toISOString() : new Date(e.date).toISOString(),
        unread: e.unread,
        starred: e.starred,
        updated_at: new Date().toISOString(),
      }))
      await supabase.from('engage_emails').upsert(rows, { onConflict: 'mailbox_id,gmail_message_id' })
      await supabase.from('engage_mailboxes').update({ last_synced_at: new Date().toISOString() }).eq('id', mailbox.id)
    }
    return NextResponse.json({ emails })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'inbox_failed'
    return NextResponse.json({ emails: [], error: message }, { status: 500 })
  }
}

