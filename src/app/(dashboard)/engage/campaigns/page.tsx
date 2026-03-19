import CampaignBuilder from '@/components/engage/CampaignBuilder'
import { getEngageCampaigns, getEngageTemplates } from '@/app/actions/engage'
import { MOCK_ENGAGE_CAMPAIGNS, MOCK_ENGAGE_LEADS, MOCK_ENGAGE_TEMPLATES } from '@/mock/engage'

export default async function EngageCampaignsPage() {
  let campaigns = MOCK_ENGAGE_CAMPAIGNS
  let templates = MOCK_ENGAGE_TEMPLATES
  try {
    const [dbCampaigns, dbTemplates] = await Promise.all([getEngageCampaigns(), getEngageTemplates()])
    if (dbCampaigns.length) campaigns = dbCampaigns
    if (dbTemplates.length) templates = dbTemplates
  } catch {
    // fallback to mock
  }
  return <CampaignBuilder initialCampaigns={campaigns} leads={MOCK_ENGAGE_LEADS} templates={templates} />
}

