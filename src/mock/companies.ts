export type IntentScore = 'High' | 'Medium' | 'Low'

export interface ProspectCompany {
  id: string
  name: string
  industry: string
  hqLocation: string
  employees: string
  fundingStage: string
  revenueRange: string
  signals: number
  intentScore: IntentScore
  logo?: string
}

export const MOCK_COMPANIES: ProspectCompany[] = [
  { id: '1', name: 'Stripe', industry: 'Fintech', hqLocation: 'San Francisco, CA', employees: '8,000+', fundingStage: 'Series I', revenueRange: '$1B+', signals: 12, intentScore: 'High' },
  { id: '2', name: 'Notion', industry: 'Software', hqLocation: 'San Francisco, CA', employees: '600+', fundingStage: 'Series C', revenueRange: '$100M-$500M', signals: 5, intentScore: 'Medium' },
  { id: '3', name: 'OpenAI', industry: 'AI', hqLocation: 'San Francisco, CA', employees: '500+', fundingStage: 'Series C', revenueRange: '$100M-$500M', signals: 28, intentScore: 'High' },
  { id: '4', name: 'Ramp', industry: 'Fintech', hqLocation: 'New York, NY', employees: '800+', fundingStage: 'Series D', revenueRange: '$100M-$500M', signals: 7, intentScore: 'Medium' },
  { id: '5', name: 'Deel', industry: 'HR Tech', hqLocation: 'San Francisco, CA', employees: '2,000+', fundingStage: 'Series D', revenueRange: '$500M-$1B', signals: 9, intentScore: 'High' },
  { id: '6', name: 'Rippling', industry: 'Software', hqLocation: 'San Francisco, CA', employees: '3,000+', fundingStage: 'Series D', revenueRange: '$500M-$1B', signals: 14, intentScore: 'High' },
  { id: '7', name: 'Mercury', industry: 'Banking', hqLocation: 'San Francisco, CA', employees: '400+', fundingStage: 'Series B', revenueRange: '$50M-$100M', signals: 3, intentScore: 'Low' },
  { id: '8', name: 'Brex', industry: 'Fintech', hqLocation: 'San Francisco, CA', employees: '1,200+', fundingStage: 'Series D', revenueRange: '$100M-$500M', signals: 6, intentScore: 'Medium' },
]
