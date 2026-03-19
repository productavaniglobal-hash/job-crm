import SequenceBuilder from '@/components/engage/SequenceBuilder'
import { getEngageSequences, getEngageTemplates } from '@/app/actions/engage'
import { MOCK_ENGAGE_TEMPLATES } from '@/mock/engage'
import type { EngageSequence } from '@/types/engage'

const MOCK_SEQUENCES: EngageSequence[] = [
  {
    id: 'sq1',
    name: 'Founder Intro Sequence',
    steps: [
      { id: 'st1', templateId: 't1', delayDays: 0 },
      { id: 'st2', templateId: 't2', delayDays: 3 },
    ],
  },
]

export default async function EngageSequencesPage() {
  let sequences = MOCK_SEQUENCES
  let templates = MOCK_ENGAGE_TEMPLATES
  try {
    const [dbSequences, dbTemplates] = await Promise.all([getEngageSequences(), getEngageTemplates()])
    if (dbSequences.length) sequences = dbSequences
    if (dbTemplates.length) templates = dbTemplates
  } catch {
    // fallback
  }
  return <SequenceBuilder initialSequences={sequences} templates={templates} />
}

