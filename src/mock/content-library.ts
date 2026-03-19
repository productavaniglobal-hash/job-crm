import type { ContentType, FunnelStage } from '@/app/actions/content-intelligence'

export type MockContentItem = {
  id: string
  title: string
  description: string
  content_body: Record<string, unknown>
  content_type: ContentType
  tags: string[]
  funnel_stage: FunnelStage
  persona: string
  industry: string
  current_version: number
  performance_metrics: {
    usage_count: number
    opened: number
    replied: number
    converted: number
  }
  created_at: string
  updated_at: string
}

const now = new Date().toISOString()

export const MOCK_CONTENT_LIBRARY: MockContentItem[] = [
  {
    id: 'mock-email-1',
    title: 'Cold intro email (Founder)',
    description: 'Short outbound intro for founders in SaaS with curiosity hook.',
    content_body: { type: 'markdown', markdown: 'Hi {{name}}, noticed {{company}} is scaling...' },
    content_type: 'email_template',
    tags: ['outbound', 'founder', 'intro'],
    funnel_stage: 'awareness',
    persona: 'Founder',
    industry: 'SaaS',
    current_version: 3,
    performance_metrics: { usage_count: 42, opened: 24, replied: 11, converted: 3 },
    created_at: now,
    updated_at: now,
  },
  {
    id: 'mock-wa-1',
    title: 'WhatsApp follow-up after demo',
    description: 'Friendly follow-up script after demo with next-step CTA.',
    content_body: { type: 'markdown', markdown: 'Hi {{name}}, thanks for joining the demo...' },
    content_type: 'whatsapp_script',
    tags: ['follow-up', 'demo', 'whatsapp'],
    funnel_stage: 'consideration',
    persona: 'CMO',
    industry: 'EdTech',
    current_version: 2,
    performance_metrics: { usage_count: 58, opened: 0, replied: 19, converted: 6 },
    created_at: now,
    updated_at: now,
  },
  {
    id: 'mock-call-1',
    title: 'Discovery call script (7 min)',
    description: 'Structured call script for qualification and pain discovery.',
    content_body: { sections: ['Opening', 'Pain discovery', 'Impact', 'Next step'] },
    content_type: 'call_script',
    tags: ['call', 'discovery', 'qualification'],
    funnel_stage: 'consideration',
    persona: 'Founder',
    industry: 'FinTech',
    current_version: 1,
    performance_metrics: { usage_count: 17, opened: 0, replied: 0, converted: 4 },
    created_at: now,
    updated_at: now,
  },
  {
    id: 'mock-playbook-1',
    title: '30-day outbound nurture playbook',
    description: 'Multi-step workflow: email -> wait -> WhatsApp -> task assignment.',
    content_body: { steps_count: 8, mode: 'playbook' },
    content_type: 'playbook',
    tags: ['playbook', 'nurture', 'outbound'],
    funnel_stage: 'awareness',
    persona: 'Growth Lead',
    industry: 'SaaS',
    current_version: 4,
    performance_metrics: { usage_count: 13, opened: 6, replied: 4, converted: 2 },
    created_at: now,
    updated_at: now,
  },
  {
    id: 'mock-case-study-1',
    title: 'Case study: 2.3x lead conversion in 45 days',
    description: 'Proof asset for mid-funnel objections and stakeholder buy-in.',
    content_body: { type: 'markdown', markdown: 'Client challenge, approach, results...' },
    content_type: 'case_study',
    tags: ['proof', 'mid-funnel', 'conversion'],
    funnel_stage: 'consideration',
    persona: 'Sales Manager',
    industry: 'Healthcare',
    current_version: 1,
    performance_metrics: { usage_count: 21, opened: 12, replied: 5, converted: 5 },
    created_at: now,
    updated_at: now,
  },
  {
    id: 'mock-ad-1',
    title: 'Ad creative pack - webinar campaign',
    description: 'Primary text + headline variants for awareness campaign.',
    content_body: { formats: ['Meta feed', 'Story'], variants: 6 },
    content_type: 'ad_creative',
    tags: ['ads', 'webinar', 'creative'],
    funnel_stage: 'awareness',
    persona: 'Performance Marketer',
    industry: 'SaaS',
    current_version: 5,
    performance_metrics: { usage_count: 33, opened: 0, replied: 0, converted: 8 },
    created_at: now,
    updated_at: now,
  },
  {
    id: 'mock-deck-1',
    title: 'Pitch deck - enterprise procurement',
    description: 'Deck for enterprise buyers with ROI and security slides.',
    content_body: { slides: 18, format: 'pptx' },
    content_type: 'pitch_deck',
    tags: ['enterprise', 'deck', 'roi'],
    funnel_stage: 'conversion',
    persona: 'Procurement Head',
    industry: 'Manufacturing',
    current_version: 2,
    performance_metrics: { usage_count: 9, opened: 0, replied: 0, converted: 3 },
    created_at: now,
    updated_at: now,
  },
  {
    id: 'mock-media-1',
    title: 'Creative assets bundle (video + image)',
    description: 'Ad-ready media assets with captions and hooks.',
    content_body: { files: [{ name: 'promo.mp4' }, { name: 'banner.webp' }] },
    content_type: 'media',
    tags: ['media', 'creative', 'assets'],
    funnel_stage: 'awareness',
    persona: 'Brand Manager',
    industry: 'D2C',
    current_version: 1,
    performance_metrics: { usage_count: 27, opened: 0, replied: 0, converted: 6 },
    created_at: now,
    updated_at: now,
  },
]

export const MOCK_PLAYBOOKS = [
  {
    id: 'mock-pb-1',
    title: 'Inbound lead qualification',
    description: 'Auto triage + intro + discovery task assignment.',
    tags: ['inbound', 'qualification'],
    funnel_stage: 'consideration',
    persona: 'Sales Rep',
    industry: 'SaaS',
  },
  {
    id: 'mock-pb-2',
    title: 'No-response reactivation',
    description: '3-touch reactivation across email and WhatsApp.',
    tags: ['reactivation', 'follow-up'],
    funnel_stage: 'awareness',
    persona: 'Founder',
    industry: 'EdTech',
  },
]

export function filterMockContent(
  items: MockContentItem[],
  filters: {
    q?: string
    type?: ContentType | 'all'
    stage?: FunnelStage | 'all'
    persona?: string | 'all'
    industry?: string | 'all'
  }
) {
  const q = (filters.q || '').toLowerCase().trim()
  return items.filter((item) => {
    if (filters.type && filters.type !== 'all' && item.content_type !== filters.type) return false
    if (filters.stage && filters.stage !== 'all' && item.funnel_stage !== filters.stage) return false
    if (filters.persona && filters.persona !== 'all' && item.persona !== filters.persona) return false
    if (filters.industry && filters.industry !== 'all' && item.industry !== filters.industry) return false
    if (q) {
      const hay = `${item.title} ${item.description} ${item.tags.join(' ')} ${item.persona} ${item.industry}`.toLowerCase()
      if (!hay.includes(q)) return false
    }
    return true
  })
}

