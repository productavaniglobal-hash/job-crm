import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'
import { getMessageSummaryById, listHistoryMessageIds, listInboxMessages, refreshAccessToken } from '@/lib/gmail'

type MailboxRow = {
  id: string
  user_id: string
  organization_id: string
  email: string
  access_token: string | null
  refresh_token: string | null
  expires_at: string | null
  gmail_history_id: string | null
}

function decodePushData(input: string) {
  const raw = Buffer.from(input, 'base64').toString('utf8')
  return JSON.parse(raw) as { emailAddress?: string; historyId?: string }
}

async function getAccessTokenForMailbox(supabase: ReturnType<typeof createServiceClient>, mailbox: MailboxRow) {
  const exp = mailbox.expires_at ? new Date(mailbox.expires_at).getTime() : 0
  const soon = Date.now() + 30_000
  if (mailbox.access_token && exp > soon) return mailbox.access_token
  if (!mailbox.refresh_token) throw new Error('Refresh token missing for mailbox')

  const refreshed = await refreshAccessToken(mailbox.refresh_token)
  const expiresAt = new Date(Date.now() + (refreshed.expires_in ?? 3600) * 1000).toISOString()
  await supabase
    .from('engage_mailboxes')
    .update({
      access_token: refreshed.access_token,
      token_type: refreshed.token_type ?? 'Bearer',
      scope: refreshed.scope ?? null,
      expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    })
    .eq('id', mailbox.id)
  return refreshed.access_token
}

export async function POST(req: NextRequest) {
  try {
    const verifyToken = process.env.ENGAGE_GMAIL_WEBHOOK_TOKEN
    if (verifyToken) {
      const token = req.nextUrl.searchParams.get('token')
      if (token !== verifyToken) return NextResponse.json({ ok: false }, { status: 401 })
    }

    const body = (await req.json()) as { message?: { data?: string } }
    const encoded = body?.message?.data
    if (!encoded) return NextResponse.json({ ok: true })

    const payload = decodePushData(encoded)
    const email = payload.emailAddress
    if (!email) return NextResponse.json({ ok: true })

    const supabase = createServiceClient()
    const { data: mailbox, error } = await supabase
      .from('engage_mailboxes')
      .select('*')
      .eq('provider', 'gmail')
      .eq('email', email)
      .limit(1)
      .maybeSingle()
    if (error || !mailbox) return NextResponse.json({ ok: true })

    const mb = mailbox as MailboxRow
    const accessToken = await getAccessTokenForMailbox(supabase, mb)

    let latestHistoryId = payload.historyId || mb.gmail_history_id || null
    let summaries: Awaited<ReturnType<typeof listInboxMessages>> = []

    if (mb.gmail_history_id) {
      try {
        const history = await listHistoryMessageIds(accessToken, mb.gmail_history_id)
        latestHistoryId = history.latestHistoryId || latestHistoryId
        if (history.messageIds.length > 0) {
          const detailList = await Promise.all(history.messageIds.slice(0, 100).map((id) => getMessageSummaryById(accessToken, id)))
          summaries = detailList
        }
      } catch {
        // If history is too old/invalid, fallback to full snapshot.
        summaries = await listInboxMessages(accessToken, {})
      }
    } else {
      summaries = await listInboxMessages(accessToken, {})
    }

    if (summaries.length > 0) {
      const rows = summaries.map((e) => ({
        mailbox_id: mb.id,
        organization_id: mb.organization_id,
        user_id: mb.user_id,
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
    }

    await supabase
      .from('engage_mailboxes')
      .update({
        gmail_history_id: latestHistoryId,
        last_synced_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', mb.id)

    return NextResponse.json({ ok: true })
  } catch {
    // Pub/Sub should receive 2xx to avoid endless retries for malformed payloads.
    return NextResponse.json({ ok: true })
  }
}

