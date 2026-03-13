export type IntentScore = 'High' | 'Medium' | 'Low'

export interface ProspectLead {
  id: string
  name: string
  title: string
  company: string
  location: string
  industry: string
  companySize: string
  fundingStage: string
  lastActivity: string
  intentScore: IntentScore
}

export const MOCK_LEADS: ProspectLead[] = [
  { id: '1', name: 'Sarah Chen', title: 'VP of Sales', company: 'Stripe', location: 'San Francisco, CA', industry: 'Fintech', companySize: '1001-5000', fundingStage: 'Series I', lastActivity: '2 days ago', intentScore: 'High' },
  { id: '2', name: 'Marcus Johnson', title: 'Head of Growth', company: 'Notion', location: 'San Francisco, CA', industry: 'Software', companySize: '501-1000', fundingStage: 'Series C', lastActivity: '1 day ago', intentScore: 'Medium' },
  { id: '3', name: 'Elena Rodriguez', title: 'Director of Partnerships', company: 'OpenAI', location: 'San Francisco, CA', industry: 'AI', companySize: '501-1000', fundingStage: 'Series C', lastActivity: '3 hours ago', intentScore: 'High' },
  { id: '4', name: 'David Kim', title: 'CFO', company: 'Ramp', location: 'New York, NY', industry: 'Fintech', companySize: '201-500', fundingStage: 'Series D', lastActivity: '5 days ago', intentScore: 'Low' },
  { id: '5', name: 'Jessica Walsh', title: 'VP of Operations', company: 'Deel', location: 'San Francisco, CA', industry: 'HR Tech', companySize: '1001-5000', fundingStage: 'Series D', lastActivity: '1 day ago', intentScore: 'Medium' },
  { id: '6', name: 'Andrew Park', title: 'CTO', company: 'Rippling', location: 'San Francisco, CA', industry: 'Software', companySize: '1001-5000', fundingStage: 'Series D', lastActivity: '4 days ago', intentScore: 'High' },
  { id: '7', name: 'Rachel Green', title: 'Head of Finance', company: 'Mercury', location: 'San Francisco, CA', industry: 'Banking', companySize: '201-500', fundingStage: 'Series B', lastActivity: '6 hours ago', intentScore: 'Medium' },
  { id: '8', name: 'James Liu', title: 'COO', company: 'Brex', location: 'San Francisco, CA', industry: 'Fintech', companySize: '501-1000', fundingStage: 'Series D', lastActivity: '2 days ago', intentScore: 'Low' },
  { id: '9', name: 'Michelle Torres', title: 'Director of Sales', company: 'HubSpot', location: 'Cambridge, MA', industry: 'Marketing', companySize: '5001+', fundingStage: 'Public', lastActivity: '1 hour ago', intentScore: 'High' },
  { id: '10', name: "Kevin O'Brien", title: 'VP of Product', company: 'Figma', location: 'San Francisco, CA', industry: 'Design', companySize: '501-1000', fundingStage: 'Series E', lastActivity: '3 days ago', intentScore: 'Medium' },
  { id: '11', name: 'Nina Patel', title: 'Head of Customer Success', company: 'Gong', location: 'San Francisco, CA', industry: 'Sales Tech', companySize: '1001-5000', fundingStage: 'Series E', lastActivity: 'Yesterday', intentScore: 'High' },
  { id: '12', name: 'Tom Wilson', title: 'CEO', company: 'Airtable', location: 'San Francisco, CA', industry: 'Software', companySize: '501-1000', fundingStage: 'Series F', lastActivity: '4 hours ago', intentScore: 'Medium' },
  { id: '13', name: 'Sophie Martin', title: 'Director of Marketing', company: 'Loom', location: 'San Francisco, CA', industry: 'Video', companySize: '201-500', fundingStage: 'Series C', lastActivity: '2 days ago', intentScore: 'Low' },
  { id: '14', name: 'Chris Evans', title: 'VP of Engineering', company: 'Vercel', location: 'San Francisco, CA', industry: 'Developer Tools', companySize: '201-500', fundingStage: 'Series D', lastActivity: '5 hours ago', intentScore: 'High' },
  { id: '15', name: 'Amanda Foster', title: 'Head of BD', company: 'Snowflake', location: 'Bozeman, MT', industry: 'Data', companySize: '5001+', fundingStage: 'Public', lastActivity: '1 day ago', intentScore: 'Medium' },
  { id: '16', name: 'Ryan Cooper', title: 'Director of Sales', company: 'Salesforce', location: 'San Francisco, CA', industry: 'CRM', companySize: '5001+', fundingStage: 'Public', lastActivity: '3 days ago', intentScore: 'Low' },
  { id: '17', name: 'Lisa Nguyen', title: 'VP of Strategy', company: 'Databricks', location: 'San Francisco, CA', industry: 'Data', companySize: '5001+', fundingStage: 'Series I', lastActivity: 'Yesterday', intentScore: 'High' },
  { id: '18', name: 'Daniel Brown', title: 'Head of Partnerships', company: 'Slack', location: 'San Francisco, CA', industry: 'Collaboration', companySize: '5001+', fundingStage: 'Acquired', lastActivity: '6 days ago', intentScore: 'Medium' },
  { id: '19', name: 'Emma Davis', title: 'CFO', company: 'Canva', location: 'Sydney, Australia', industry: 'Design', companySize: '1001-5000', fundingStage: 'Series C', lastActivity: '4 days ago', intentScore: 'Low' },
  { id: '20', name: 'Michael Zhang', title: 'VP of Sales', company: 'Zoom', location: 'San Jose, CA', industry: 'Communication', companySize: '5001+', fundingStage: 'Public', lastActivity: '2 hours ago', intentScore: 'High' },
]
