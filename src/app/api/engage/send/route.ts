import { NextRequest, NextResponse } from 'next/server'
import { getValidGmailAccessToken } from '@/app/actions/engage'
import { sendEmail } from '@/lib/gmail'
import type { ComposePayload } from '@/types/engage'

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ComposePayload
    if (!body?.to || !body?.subject || !body?.bodyHtml) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const accessToken = await getValidGmailAccessToken()
    await sendEmail(accessToken, body)
    return NextResponse.json({ ok: true })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'send_failed'
    return NextResponse.json({ ok: false, error: message }, { status: 500 })
  }
}

