import EngageSettingsClient from '@/components/engage/EngageSettingsClient'
import { getMailboxSyncStatus } from '@/app/actions/engage'

export default async function EngageSettingsPage() {
  let status: { email: string; lastSyncedAt: string | null; watchExpiration: string | null; historyId: string | null } | null = null
  try {
    status = await getMailboxSyncStatus()
  } catch {
    status = null
  }
  return (
    <EngageSettingsClient
      mailboxEmail={status?.email || null}
      lastSyncedAt={status?.lastSyncedAt || null}
      watchExpiration={status?.watchExpiration || null}
      historyId={status?.historyId || null}
    />
  )
}

