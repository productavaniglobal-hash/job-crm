export type IntentScore = 'High' | 'Medium' | 'Low'

export interface AnonymousVisitor {
  id: string
  companyName: string
  industry: string
  employees: string
  location: string
  pagesVisited: number
  timeOnSite: string
  lastVisit: string
  intentScore: IntentScore
}

export const MOCK_VISITORS: AnonymousVisitor[] = [
  { id: '1', companyName: 'Stripe', industry: 'Fintech', employees: '8,000+', location: 'San Francisco, CA', pagesVisited: 12, timeOnSite: '18m 42s', lastVisit: '2 hours ago', intentScore: 'High' },
  { id: '2', companyName: 'OpenAI', industry: 'AI', employees: '500+', location: 'San Francisco, CA', pagesVisited: 8, timeOnSite: '12m 15s', lastVisit: '5 hours ago', intentScore: 'High' },
  { id: '3', companyName: 'HubSpot', industry: 'Marketing', employees: '7,000+', location: 'Cambridge, MA', pagesVisited: 15, timeOnSite: '24m 30s', lastVisit: '1 hour ago', intentScore: 'High' },
  { id: '4', companyName: 'Notion', industry: 'Software', employees: '600+', location: 'San Francisco, CA', pagesVisited: 5, timeOnSite: '6m 20s', lastVisit: 'Yesterday', intentScore: 'Medium' },
  { id: '5', companyName: 'Rippling', industry: 'Software', employees: '3,000+', location: 'San Francisco, CA', pagesVisited: 9, timeOnSite: '14m 10s', lastVisit: '3 hours ago', intentScore: 'Medium' },
  { id: '6', companyName: 'Figma', industry: 'Design', employees: '800+', location: 'San Francisco, CA', pagesVisited: 3, timeOnSite: '2m 45s', lastVisit: '4 days ago', intentScore: 'Low' },
  { id: '7', companyName: 'Vercel', industry: 'Developer Tools', employees: '400+', location: 'San Francisco, CA', pagesVisited: 7, timeOnSite: '9m 00s', lastVisit: '6 hours ago', intentScore: 'Medium' },
  { id: '8', companyName: 'Linear', industry: 'Software', employees: '150+', location: 'San Francisco, CA', pagesVisited: 11, timeOnSite: '16m 55s', lastVisit: 'Yesterday', intentScore: 'High' },
  { id: '9', companyName: 'Loom', industry: 'Video', employees: '300+', location: 'San Francisco, CA', pagesVisited: 4, timeOnSite: '4m 12s', lastVisit: '3 days ago', intentScore: 'Low' },
  { id: '10', companyName: 'Gong', industry: 'Sales Tech', employees: '1,500+', location: 'San Francisco, CA', pagesVisited: 6, timeOnSite: '8m 33s', lastVisit: '12 hours ago', intentScore: 'Medium' },
]
