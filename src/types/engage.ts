export type EngageEmailSummary = {
  id: string
  threadId: string
  from: string
  to?: string
  subject: string
  snippet: string
  date: string
  unread: boolean
  starred: boolean
}

export type EngageThreadMessage = {
  id: string
  from: string
  to: string
  subject: string
  date: string
  bodyHtml: string
  bodyText: string
}

export type EngageThread = {
  id: string
  subject: string
  messages: EngageThreadMessage[]
}

export type ComposePayload = {
  to: string
  subject: string
  bodyHtml: string
}

export type EngageLead = {
  id: string
  name: string
  email: string
  company: string
}

export type EngageTemplate = {
  id: string
  name: string
  subject: string
  body: string
  updatedAt: string
}

export type EngageSequenceStep = {
  id: string
  templateId: string
  delayDays: number
}

export type EngageSequence = {
  id: string
  name: string
  steps: EngageSequenceStep[]
}

export type EngageCampaign = {
  id: string
  name: string
  audienceLeadIds: string[]
  templateId: string
  scheduleAt: string
  status: 'draft' | 'scheduled' | 'running' | 'completed'
}

