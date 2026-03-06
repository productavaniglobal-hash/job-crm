'use client'

import { ConversationList } from "@/components/inbox/ConversationList"
import { ChatWindow } from "@/components/inbox/ChatWindow"
import { useState } from "react"

export default function InboxPage() {
  const [activeId, setActiveId] = useState<string | undefined>()
  const [activeLead, setActiveLead] = useState<any | undefined>()

  return (
    <div className="flex h-full w-full overflow-hidden bg-[#f0f2f5] dark:bg-[#0b141a] relative">
      <ConversationList
        activeId={activeId}
        onSelect={(id, lead) => {
          setActiveId(id)
          setActiveLead(lead)
        }}
      />
      <ChatWindow
        conversationId={activeId}
        leadId={activeLead?.id}
        leadName={activeLead?.name || activeLead?.contact_person}
      />
    </div>
  )
}

