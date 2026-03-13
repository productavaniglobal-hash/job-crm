export interface SignalType {
  id: string
  title: string
  description: string
}

export const MOCK_SIGNALS: SignalType[] = [
  {
    id: 'funding',
    title: 'New Funding Announcement',
    description: 'Track when companies announce new funding rounds or raise capital',
  },
  {
    id: 'product',
    title: 'New Product Launch',
    description: 'Track when companies launch new products or services',
  },
  {
    id: 'acquisition',
    title: 'Acquisition News',
    description: 'Track when companies announce acquisitions or get acquired',
  },
  {
    id: 'awards',
    title: 'Awards & Recognition',
    description: 'Track when companies receive awards or industry recognition',
  },
  {
    id: 'partnership',
    title: 'New Partnership Announcement',
    description: 'Track when companies announce new partnerships or collaborations',
  },
  {
    id: 'layoffs',
    title: 'Layoffs',
    description: 'Track when companies announce layoffs or workforce reductions',
  },
  {
    id: 'expansion',
    title: 'Office Expansion',
    description: 'Track when companies expand to new locations or open new offices',
  },
  {
    id: 'key-hire',
    title: 'Key Hire',
    description: 'Track when companies make important leadership or executive hires',
  },
  {
    id: 'keywords',
    title: 'Keywords Mentioned in News',
    description: 'Track when target keywords are getting news coverage',
  },
]
