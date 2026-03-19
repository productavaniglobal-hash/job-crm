import type { ComposePayload, EngageEmailSummary, EngageThread, EngageThreadMessage } from '@/types/engage'

const GMAIL_BASE = 'https://gmail.googleapis.com/gmail/v1'
const GOOGLE_OAUTH_BASE = 'https://accounts.google.com/o/oauth2/v2/auth'
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'

type OAuthTokenResponse = {
  access_token: string
  expires_in: number
  refresh_token?: string
  scope?: string
  token_type?: string
}

function env(name: string) {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is missing`)
  return value
}

function decodeBase64Url(input: string) {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
  return Buffer.from(normalized, 'base64').toString('utf8')
}

function encodeBase64Url(input: string) {
  return Buffer.from(input, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

async function gmailFetch<T>(path: string, accessToken: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${GMAIL_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Gmail API ${res.status}: ${text}`)
  }
  return res.json() as Promise<T>
}

export function getGmailScopes() {
  return [
    'openid',
    'email',
    'profile',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.modify',
  ]
}

export function buildGmailOAuthUrl(state: string) {
  const clientId = env('GOOGLE_CLIENT_ID')
  const redirectUri = env('GOOGLE_REDIRECT_URI')
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    access_type: 'offline',
    prompt: 'consent',
    scope: getGmailScopes().join(' '),
    state,
  })
  return `${GOOGLE_OAUTH_BASE}?${params.toString()}`
}

export async function exchangeCodeForTokens(code: string) {
  const clientId = env('GOOGLE_CLIENT_ID')
  const clientSecret = env('GOOGLE_CLIENT_SECRET')
  const redirectUri = env('GOOGLE_REDIRECT_URI')
  const body = new URLSearchParams({
    code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  })
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Token exchange failed: ${txt}`)
  }
  return (await res.json()) as OAuthTokenResponse
}

export async function refreshAccessToken(refreshToken: string) {
  const clientId = env('GOOGLE_CLIENT_ID')
  const clientSecret = env('GOOGLE_CLIENT_SECRET')
  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  })
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Token refresh failed: ${txt}`)
  }
  return (await res.json()) as OAuthTokenResponse
}

export async function getGoogleProfileEmail(accessToken: string) {
  const res = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Failed to fetch profile email: ${txt}`)
  }
  const data = (await res.json()) as { email?: string }
  if (!data.email) throw new Error('Google profile did not include email')
  return data.email
}

function parseHeader(headers: Array<{ name: string; value: string }> | undefined, name: string) {
  return headers?.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ?? ''
}

function extractBody(payload: unknown): { bodyText: string; bodyHtml: string } {
  const root = (payload ?? {}) as {
    parts?: unknown[]
    mimeType?: string
    body?: { data?: string }
  }
  let html = ''
  let text = ''

  const walk = (node: unknown) => {
    const n = (node ?? {}) as {
      mimeType?: string
      body?: { data?: string }
      parts?: unknown[]
    }
    if (!node) return
    if (n.mimeType === 'text/plain' && n.body?.data) {
      text ||= decodeBase64Url(n.body.data)
    } else if (n.mimeType === 'text/html' && n.body?.data) {
      html ||= decodeBase64Url(n.body.data)
    }
    if (Array.isArray(n.parts)) n.parts.forEach(walk)
  }

  walk(root)
  if (!text && root.body?.data) text = decodeBase64Url(root.body.data)
  if (!html && text) html = `<pre style="white-space:pre-wrap;font-family:inherit">${text}</pre>`
  return { bodyText: text, bodyHtml: html }
}

export async function listInboxMessages(accessToken: string, opts?: { q?: string; unread?: boolean; starred?: boolean }) {
  const queryParts: string[] = []
  if (opts?.q) queryParts.push(opts.q)
  if (opts?.unread) queryParts.push('is:unread')
  if (opts?.starred) queryParts.push('is:starred')
  const q = queryParts.join(' ').trim()
  const path = `/users/me/messages?maxResults=30${q ? `&q=${encodeURIComponent(q)}` : ''}`
  const list = await gmailFetch<{ messages?: Array<{ id: string; threadId: string }> }>(path, accessToken)
  const ids = list.messages ?? []
  if (!ids.length) return [] as EngageEmailSummary[]

  const details = await Promise.all(
    ids.map((m) =>
      gmailFetch<{
        id?: string
        threadId?: string
        snippet?: string
        labelIds?: string[]
        payload?: { headers?: Array<{ name: string; value: string }> }
      }>(`/users/me/messages/${m.id}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Subject&metadataHeaders=Date`, accessToken)
    )
  )

  return details.map((msg) => {
    const headers = msg.payload?.headers as Array<{ name: string; value: string }> | undefined
    const labelIds = (msg.labelIds ?? []) as string[]
    return {
      id: String(msg.id ?? ''),
      threadId: String(msg.threadId ?? ''),
      from: parseHeader(headers, 'From') || '(unknown)',
      to: parseHeader(headers, 'To'),
      subject: parseHeader(headers, 'Subject') || '(no subject)',
      snippet: msg.snippet || '',
      date: parseHeader(headers, 'Date') || new Date().toISOString(),
      unread: labelIds.includes('UNREAD'),
      starred: labelIds.includes('STARRED'),
    } satisfies EngageEmailSummary
  })
}

export async function getThreadById(accessToken: string, threadId: string): Promise<EngageThread> {
  const data = await gmailFetch<{ id?: string; messages?: Array<{ id?: string; payload?: unknown }> }>(`/users/me/threads/${threadId}?format=full`, accessToken)
  const messages = (data.messages ?? []).map((msg) => {
    const payload = (msg.payload ?? {}) as { headers?: Array<{ name: string; value: string }> }
    const headers = payload.headers
    const body = extractBody(msg.payload)
    return {
      id: String(msg.id ?? ''),
      from: parseHeader(headers, 'From') || '(unknown)',
      to: parseHeader(headers, 'To') || '',
      subject: parseHeader(headers, 'Subject') || '(no subject)',
      date: parseHeader(headers, 'Date') || new Date().toISOString(),
      bodyHtml: body.bodyHtml,
      bodyText: body.bodyText,
    } satisfies EngageThreadMessage
  })
  return {
    id: String(data.id ?? threadId),
    subject: messages[0]?.subject || '(no subject)',
    messages,
  }
}

export async function sendEmail(accessToken: string, payload: ComposePayload) {
  const message = [
    `To: ${payload.to}`,
    `Subject: ${payload.subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    '',
    payload.bodyHtml,
  ].join('\r\n')

  const raw = encodeBase64Url(message)
  return gmailFetch('/users/me/messages/send', accessToken, {
    method: 'POST',
    body: JSON.stringify({ raw }),
  })
}

export async function getMessageSummaryById(accessToken: string, messageId: string) {
  const msg = await gmailFetch<{
    id?: string
    threadId?: string
    snippet?: string
    labelIds?: string[]
    payload?: { headers?: Array<{ name: string; value: string }> }
  }>(`/users/me/messages/${messageId}?format=metadata&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Subject&metadataHeaders=Date`, accessToken)

  const headers = msg.payload?.headers
  const labelIds = msg.labelIds ?? []
  return {
    id: String(msg.id ?? ''),
    threadId: String(msg.threadId ?? ''),
    from: parseHeader(headers, 'From') || '(unknown)',
    to: parseHeader(headers, 'To'),
    subject: parseHeader(headers, 'Subject') || '(no subject)',
    snippet: msg.snippet || '',
    date: parseHeader(headers, 'Date') || new Date().toISOString(),
    unread: labelIds.includes('UNREAD'),
    starred: labelIds.includes('STARRED'),
  } satisfies EngageEmailSummary
}

export async function startGmailWatch(accessToken: string) {
  const topicName = env('GOOGLE_PUBSUB_TOPIC_NAME')
  return gmailFetch<{ historyId?: string; expiration?: string }>('/users/me/watch', accessToken, {
    method: 'POST',
    body: JSON.stringify({
      topicName,
      labelIds: ['INBOX'],
      labelFilterAction: 'include',
    }),
  })
}

export async function listHistoryMessageIds(accessToken: string, startHistoryId: string) {
  const items: string[] = []
  let latestHistoryId = startHistoryId
  let pageToken: string | undefined

  for (let i = 0; i < 5; i++) {
    const qs = new URLSearchParams({
      startHistoryId,
      historyTypes: 'messageAdded',
      maxResults: '100',
    })
    if (pageToken) qs.set('pageToken', pageToken)

    const data = await gmailFetch<{
      historyId?: string
      nextPageToken?: string
      history?: Array<{
        id?: string
        messagesAdded?: Array<{ message?: { id?: string } }>
      }>
    }>(`/users/me/history?${qs.toString()}`, accessToken)

    if (data.historyId) latestHistoryId = String(data.historyId)
    for (const h of data.history ?? []) {
      if (h.id) latestHistoryId = String(h.id)
      for (const ma of h.messagesAdded ?? []) {
        const id = ma.message?.id
        if (id) items.push(id)
      }
    }
    pageToken = data.nextPageToken
    if (!pageToken) break
  }

  return {
    messageIds: Array.from(new Set(items)),
    latestHistoryId,
  }
}

