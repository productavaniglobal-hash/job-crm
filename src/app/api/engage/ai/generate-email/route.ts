import { NextRequest, NextResponse } from 'next/server'
import { generateWithFlash } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { goal?: string; audience?: string; tone?: string }
    if (!body.goal || !body.audience || !body.tone) {
      return NextResponse.json({ error: 'goal, audience and tone are required' }, { status: 400 })
    }

    const prompt = [
      'Write a concise outbound email.',
      `Goal: ${body.goal}`,
      `Audience: ${body.audience}`,
      `Tone: ${body.tone}`,
      'Return only JSON with keys subject and bodyHtml.',
    ].join('\n')

    const text = await generateWithFlash(prompt)
    const parsed = (() => {
      try {
        return JSON.parse(text)
      } catch {
        const m = text.match(/\{[\s\S]*\}/)
        return m ? JSON.parse(m[0]) : { subject: 'Quick follow-up', bodyHtml: `<p>${text}</p>` }
      }
    })() as { subject?: string; bodyHtml?: string }

    return NextResponse.json({
      subject: parsed.subject || 'Quick follow-up',
      bodyHtml: parsed.bodyHtml || '<p>Hi there,</p><p>Wanted to quickly connect.</p>',
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'ai_generation_failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

