'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { listInboxMessages, refreshAccessToken, startGmailWatch } from '@/lib/gmail'
import type { EngageCampaign, EngageSequence, EngageTemplate } from '@/types/engage'

type DbClient = Awaited<ReturnType<typeof createClient>>

async function getDefaultOrgId(supabase: DbClient) {
  const { data } = await supabase.from('organizations').select('id').limit(1).single()
  return data?.id as string | undefined
}

async function getCurrentActor(supabase: DbClient) {
  const cookieStore = await cookies()
  const isMockAuth = cookieStore.get('sb-mock-auth')?.value === 'true'
  const { data: authData } = await supabase.auth.getUser()
  let userId = authData?.user?.id ?? null

  if (!userId && isMockAuth) {
    const { data: firstUser } = await supabase.from('users').select('id').limit(1).single()
    userId = firstUser?.id ?? null
  }
  if (!userId) throw new Error('Authentication required')
  const orgId = await getDefaultOrgId(supabase)
  if (!orgId) throw new Error('No organization found')
  return { userId, orgId }
}

export async function upsertGmailMailbox(input: {
  email: string
  accessToken: string
  refreshToken?: string
  tokenType?: string
  scope?: string
  expiresIn?: number
}) {
  const supabase = await createClient()
  const { userId, orgId } = await getCurrentActor(supabase)
  const expiresAt = input.expiresIn
    ? new Date(Date.now() + input.expiresIn * 1000).toISOString()
    : null

  const { error } = await supabase.from('engage_mailboxes').upsert(
    {
      user_id: userId,
      organization_id: orgId,
      provider: 'gmail',
      email: input.email,
      access_token: input.accessToken,
      refresh_token: input.refreshToken ?? null,
      token_type: input.tokenType ?? 'Bearer',
      scope: input.scope ?? null,
      expires_at: expiresAt,
      updated_at: new Date().toISOString(),
      connected_at: new Date().toISOString(),
    },
    { onConflict: 'user_id,provider,email' }
  )
  if (error) throw new Error(error.message)
}

export async function getGmailMailbox() {
  const supabase = await createClient()
  const { userId } = await getCurrentActor(supabase)
  const { data, error } = await supabase
    .from('engage_mailboxes')
    .select('*')
    .eq('user_id', userId)
    .eq('provider', 'gmail')
    .order('connected_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return data
}

export async function getMailboxSyncStatus() {
  const mailbox = await getGmailMailbox()
  if (!mailbox) return null
  return {
    email: mailbox.email as string,
    lastSyncedAt: mailbox.last_synced_at as string | null,
    watchExpiration: mailbox.gmail_watch_expiration as string | null,
    historyId: mailbox.gmail_history_id as string | null,
  }
}

export async function getValidGmailAccessToken() {
  const supabase = await createClient()
  const mailbox = await getGmailMailbox()
  if (!mailbox) throw new Error('No Gmail mailbox connected')

  const exp = mailbox.expires_at ? new Date(mailbox.expires_at).getTime() : 0
  const soon = Date.now() + 30_000
  if (mailbox.access_token && exp > soon) return mailbox.access_token as string

  if (!mailbox.refresh_token) throw new Error('Gmail refresh token missing')
  const refreshed = await refreshAccessToken(mailbox.refresh_token as string)
  const expiresAt = new Date(Date.now() + (refreshed.expires_in ?? 3600) * 1000).toISOString()

  const { error } = await supabase
    .from('engage_mailboxes')
    .update({
      access_token: refreshed.access_token,
      token_type: refreshed.token_type ?? 'Bearer',
      scope: refreshed.scope ?? mailbox.scope,
      expires_at: expiresAt,
      updated_at: new Date().toISOString(),
    })
    .eq('id', mailbox.id)
  if (error) throw new Error(error.message)
  return refreshed.access_token
}

export async function registerGmailWatch() {
  const supabase = await createClient()
  const mailbox = await getGmailMailbox()
  if (!mailbox) throw new Error('No Gmail mailbox connected')
  const accessToken = await getValidGmailAccessToken()
  const watch = await startGmailWatch(accessToken)
  const watchExpiration = watch.expiration ? new Date(Number(watch.expiration)).toISOString() : null

  const { error } = await supabase
    .from('engage_mailboxes')
    .update({
      gmail_history_id: watch.historyId ?? mailbox.gmail_history_id ?? null,
      gmail_watch_expiration: watchExpiration,
      updated_at: new Date().toISOString(),
    })
    .eq('id', mailbox.id)
  if (error) throw new Error(error.message)

  // initial sync snapshot
  const snapshot = await listInboxMessages(accessToken, {})
  if (snapshot.length) {
    const rows = snapshot.map((e) => ({
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
    const { error: upsertError } = await supabase
      .from('engage_emails')
      .upsert(rows, { onConflict: 'mailbox_id,gmail_message_id' })
    if (upsertError) throw new Error(upsertError.message)
  }

  await supabase
    .from('engage_mailboxes')
    .update({ last_synced_at: new Date().toISOString() })
    .eq('id', mailbox.id)

  revalidatePath('/engage/settings')
}

export async function getEngageCampaigns(): Promise<EngageCampaign[]> {
  const supabase = await createClient()
  const { orgId } = await getCurrentActor(supabase)
  const { data, error } = await supabase
    .from('engage_campaigns')
    .select('*')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })
  if (error) return []
  return (data ?? []).map((x) => ({
    id: String(x.id),
    name: String(x.name),
    audienceLeadIds: Array.isArray(x.audience_lead_ids) ? x.audience_lead_ids.map(String) : [],
    templateId: x.template_id ? String(x.template_id) : '',
    scheduleAt: x.schedule_at ? String(x.schedule_at) : new Date().toISOString(),
    status: (x.status ?? 'draft') as EngageCampaign['status'],
  }))
}

export async function createEngageCampaign(input: Omit<EngageCampaign, 'id'>) {
  const supabase = await createClient()
  const { orgId, userId } = await getCurrentActor(supabase)
  const { error } = await supabase.from('engage_campaigns').insert({
    organization_id: orgId,
    created_by: userId,
    name: input.name,
    audience_lead_ids: input.audienceLeadIds,
    template_id: input.templateId || null,
    schedule_at: input.scheduleAt,
    status: input.status,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/engage/campaigns')
}

export async function getEngageTemplates(): Promise<EngageTemplate[]> {
  const supabase = await createClient()
  const { orgId } = await getCurrentActor(supabase)
  const { data, error } = await supabase
    .from('engage_templates')
    .select('*')
    .eq('organization_id', orgId)
    .order('updated_at', { ascending: false })
  if (error) return []
  return (data ?? []).map((x) => ({
    id: String(x.id),
    name: String(x.name),
    subject: String(x.subject ?? ''),
    body: String(x.body ?? ''),
    updatedAt: String(x.updated_at ?? new Date().toISOString()),
  }))
}

export async function upsertEngageTemplate(input: Omit<EngageTemplate, 'updatedAt'>) {
  const supabase = await createClient()
  const { orgId, userId } = await getCurrentActor(supabase)
  const payload = {
    id: input.id || undefined,
    organization_id: orgId,
    created_by: userId,
    name: input.name,
    subject: input.subject,
    body: input.body,
    updated_at: new Date().toISOString(),
  }
  const { error } = await supabase.from('engage_templates').upsert(payload)
  if (error) throw new Error(error.message)
  revalidatePath('/engage/templates')
}

export async function getEngageSequences(): Promise<EngageSequence[]> {
  const supabase = await createClient()
  const { orgId } = await getCurrentActor(supabase)
  const { data, error } = await supabase
    .from('engage_sequences')
    .select('*')
    .eq('organization_id', orgId)
    .order('created_at', { ascending: false })
  if (error) return []
  return (data ?? []).map((x) => ({
    id: String(x.id),
    name: String(x.name),
    steps: Array.isArray(x.steps)
      ? x.steps.map((s: unknown, idx: number) => {
          const step = (s ?? {}) as { id?: unknown; templateId?: unknown; delayDays?: unknown }
          return {
            id: String(step.id ?? `step-${idx}`),
            templateId: String(step.templateId ?? ''),
            delayDays: Number(step.delayDays ?? 1),
          }
        })
      : [],
  }))
}

export async function createEngageSequence(input: Omit<EngageSequence, 'id'>) {
  const supabase = await createClient()
  const { orgId, userId } = await getCurrentActor(supabase)
  const { error } = await supabase.from('engage_sequences').insert({
    organization_id: orgId,
    created_by: userId,
    name: input.name,
    steps: input.steps,
  })
  if (error) throw new Error(error.message)
  revalidatePath('/engage/sequences')
}

