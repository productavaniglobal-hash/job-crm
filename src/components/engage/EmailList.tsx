'use client'

import { Search, Star } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { EngageEmailSummary } from '@/types/engage'

export default function EmailList({
  emails,
  activeThreadId,
  search,
  onSearchChange,
  unreadOnly,
  starredOnly,
  onToggleUnread,
  onToggleStarred,
  onSelect,
  loading,
}: {
  emails: EngageEmailSummary[]
  activeThreadId: string | null
  search: string
  onSearchChange: (v: string) => void
  unreadOnly: boolean
  starredOnly: boolean
  onToggleUnread: () => void
  onToggleStarred: () => void
  onSelect: (email: EngageEmailSummary) => void
  loading?: boolean
}) {
  return (
    <div className="h-full flex flex-col rounded-2xl border bg-card">
      <div className="p-3 border-b space-y-2">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search emails"
            className="pl-9 rounded-xl"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" size="sm" variant={unreadOnly ? 'default' : 'outline'} onClick={onToggleUnread}>
            Unread
          </Button>
          <Button type="button" size="sm" variant={starredOnly ? 'default' : 'outline'} onClick={onToggleStarred}>
            <Star className="h-4 w-4 mr-2" /> Starred
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="p-3 space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-xl border p-3 animate-pulse">
                <div className="h-4 bg-muted rounded w-1/2 mb-2" />
                <div className="h-3 bg-muted rounded w-2/3 mb-2" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : !emails.length ? (
          <div className="text-sm text-muted-foreground text-center py-12">No emails found</div>
        ) : (
          <div className="p-2 space-y-1.5">
            {emails.map((email) => {
              const active = email.threadId === activeThreadId
              return (
                <button
                  key={email.id}
                  type="button"
                  onClick={() => onSelect(email)}
                  className={`w-full text-left rounded-xl border p-3 transition-colors ${
                    active ? 'bg-blue-500/10 border-blue-500/30' : 'hover:bg-accent/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-sm truncate ${email.unread ? 'font-semibold' : 'font-medium'}`}>{email.from}</p>
                    <span className="text-[11px] text-muted-foreground shrink-0">{new Date(email.date).toLocaleTimeString()}</span>
                  </div>
                  <p className={`text-sm truncate ${email.unread ? 'font-medium' : ''}`}>{email.subject}</p>
                  <p className="text-xs text-muted-foreground truncate">{email.snippet}</p>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

