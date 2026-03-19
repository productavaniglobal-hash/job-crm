import { NextRequest, NextResponse } from 'next/server'
import { getValidGmailAccessToken } from '@/app/actions/engage'
import { getThreadById } from '@/lib/gmail'

export async function GET(_req: NextRequest, ctx: { params: Promise<{ threadId: string }> }) {
  try {
    const { threadId } = await ctx.params
    const accessToken = await getValidGmailAccessToken()
    const thread = await getThreadById(accessToken, threadId)
    return NextResponse.json({ thread })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'thread_failed'
    return NextResponse.json({ thread: null, error: message }, { status: 500 })
  }
}

