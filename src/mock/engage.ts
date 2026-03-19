import type { EngageCampaign, EngageLead, EngageTemplate } from '@/types/engage'

export const MOCK_ENGAGE_LEADS: EngageLead[] = [
  { id: 'l1', name: 'Riya Kapoor', email: 'riya@nimbuslabs.com', company: 'Nimbus Labs' },
  { id: 'l2', name: 'Aarav Mehta', email: 'aarav@aurora.ai', company: 'Aurora AI' },
  { id: 'l3', name: 'Neha Sharma', email: 'neha@redbrick.io', company: 'Redbrick' },
  { id: 'l4', name: 'Rahul Jain', email: 'rahul@scaleops.co', company: 'ScaleOps' },
  { id: 'l5', name: 'Ishita Verma', email: 'ishita@finverse.in', company: 'Finverse' },
]

export const MOCK_ENGAGE_TEMPLATES: EngageTemplate[] = [
  {
    id: 't1',
    name: 'Intro - Product Fit',
    subject: 'Quick intro for {{company}}',
    body: 'Hi {{name}},\n\nNoticed {{company}} is scaling outbound. Happy to share a short playbook.\n\nBest,\nTeam',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 't2',
    name: 'Follow up - Demo',
    subject: 'Following up on our chat',
    body: 'Hi {{name}},\n\nSharing 2 slots for a short demo this week.\n\nBest,\nTeam',
    updatedAt: new Date().toISOString(),
  },
]

export const MOCK_ENGAGE_CAMPAIGNS: EngageCampaign[] = [
  {
    id: 'c1',
    name: 'Q2 Outbound - SaaS Founders',
    audienceLeadIds: ['l1', 'l2', 'l3'],
    templateId: 't1',
    scheduleAt: new Date(Date.now() + 86400000).toISOString(),
    status: 'scheduled',
  },
]

