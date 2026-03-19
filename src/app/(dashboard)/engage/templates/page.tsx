import TemplatesClient from '@/components/engage/TemplatesClient'
import { getEngageTemplates } from '@/app/actions/engage'
import { MOCK_ENGAGE_TEMPLATES } from '@/mock/engage'

export default async function EngageTemplatesPage() {
  let templates = MOCK_ENGAGE_TEMPLATES
  try {
    const dbTemplates = await getEngageTemplates()
    if (dbTemplates.length) templates = dbTemplates
  } catch {
    // fallback
  }
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Templates</h1>
      <TemplatesClient initialTemplates={templates} />
    </div>
  )
}

