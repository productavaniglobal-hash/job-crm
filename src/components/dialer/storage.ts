import type { DialerLead } from '@/components/dialer/types'

export type CallDirection = 'outbound' | 'inbound'

export type CallLog = {
  id: string
  leadId: string | null
  leadName: string
  company: string
  phone: string
  direction: CallDirection
  startedAt: string
  endedAt: string
  durationSeconds: number
  outcome: 'connected' | 'no_answer' | 'voicemail' | 'failed'
  hasRecording: boolean
  recordingUrl?: string | null
  notes?: string
  transcript?: string
  summary?: {
    overview: string
    key_points: string[]
    objections: string[]
    next_steps: string[]
    sentiment?: string
    risk_flags?: string[]
  }
  ai_generated_at?: string
  tags?: string[]
  scorecard?: {
    talk_ratio?: number
    clarity?: number
    empathy?: number
    next_step_set?: boolean
  }
}

const KEY = 'dialer.callLogs.v1'

export function loadCallLogs(): CallLog[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveCallLogs(logs: CallLog[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEY, JSON.stringify(logs.slice(0, 500)))
}

export function seedCallLogs(leads: DialerLead[]): CallLog[] {
  const now = Date.now()
  const pick = (i: number) => leads[i % leads.length]
  const sample: CallLog[] = Array.from({ length: 18 }).map((_, i) => {
    const lead = pick(i)
    const started = new Date(now - (i + 2) * 36e5)
    const duration = 35 + (i % 6) * 22
    const ended = new Date(started.getTime() + duration * 1000)
    const connected = i % 3 !== 0
    const transcript = connected
      ? `Agent: Hi ${lead?.name || 'there'}, thanks for picking up.\nLead: Sure, what’s this about?\nAgent: Quick context — helping teams like ${lead?.company || 'your company'} improve follow-up speed.\nLead: We’re evaluating options but timing is tight.\nAgent: Understood. What would success look like in 30 days?\nLead: Faster response + better tracking.\nAgent: Great. I’ll send a 2-minute overview and we can schedule a short demo.`
      : ''
    return {
      id: `cl_${started.getTime()}_${i}`,
      leadId: lead?.id ?? null,
      leadName: lead?.name ?? 'Unknown',
      company: lead?.company ?? '-',
      phone: lead?.phone ?? '-',
      direction: 'outbound',
      startedAt: started.toISOString(),
      endedAt: ended.toISOString(),
      durationSeconds: duration,
      outcome: connected ? 'connected' : (i % 2 === 0 ? 'no_answer' : 'voicemail'),
      hasRecording: connected && i % 4 === 0,
      recordingUrl: null,
      notes: connected ? 'Discussed next steps. Send recap.' : '',
      transcript,
      summary: connected
        ? {
          overview: 'Discussed current workflow and agreed to review a short overview before scheduling a demo.',
          key_points: ['Lead wants faster response time', 'Needs better tracking and ownership', 'Timing is tight this week'],
          objections: ['Timing is tight'],
          next_steps: ['Send 2-minute overview', 'Propose 2 demo slots', 'Confirm decision maker'],
          sentiment: 'neutral',
          risk_flags: [],
        }
        : undefined,
      ai_generated_at: connected ? ended.toISOString() : undefined,
      tags: connected ? ['discovery', 'follow-up'] : [],
      scorecard: connected
        ? { talk_ratio: 0.55, clarity: 4, empathy: 4, next_step_set: true }
        : undefined,
    }
  })
  return sample
}

