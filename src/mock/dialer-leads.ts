export type DialerLead = {
  id: string
  name: string
  company: string
  phone: string
  status: 'Hot' | 'Warm' | 'Cold'
  title: string
}

export const MOCK_DIALER_LEADS: DialerLead[] = [
  { id: 'dl-1', name: 'Riya Kapoor', company: 'Nimbus Labs', phone: '+91 98765 12340', status: 'Hot', title: 'Founder' },
  { id: 'dl-2', name: 'Arjun Mehta', company: 'ScaleForge', phone: '+91 98765 12341', status: 'Warm', title: 'Growth Lead' },
  { id: 'dl-3', name: 'Nina Thomas', company: 'PixelPilot', phone: '+91 98765 12342', status: 'Cold', title: 'Marketing Manager' },
  { id: 'dl-4', name: 'Kabir Shah', company: 'FinEdge', phone: '+91 98765 12343', status: 'Hot', title: 'CMO' },
  { id: 'dl-5', name: 'Meera Iyer', company: 'Learnloop', phone: '+91 98765 12344', status: 'Warm', title: 'Sales Director' },
  { id: 'dl-6', name: 'Ankit Rao', company: 'OpsVista', phone: '+91 98765 12345', status: 'Cold', title: 'VP Revenue' },
  { id: 'dl-7', name: 'Sara Khan', company: 'BluePeak AI', phone: '+91 98765 12346', status: 'Hot', title: 'Founder' },
  { id: 'dl-8', name: 'Dev Patel', company: 'MarketMint', phone: '+91 98765 12347', status: 'Warm', title: 'Performance Lead' },
]

