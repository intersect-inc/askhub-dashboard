'use client'

import { PageHeader } from '@/components/elements/page-header'
import { MessageDrawer } from '@/features/logs/components/messageDrawer'
import { RiHistoryLine } from '@remixicon/react'

export default function LogsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col overflow-auto">
        <PageHeader
          title="ログ"
          description="Askhubの利用ログを確認できます。"
          leftIcon={<RiHistoryLine />}
        />
        {children}
      </div>
      <MessageDrawer />
    </div>
  )
}
