import { PageHeader } from '@/components/elements/page-header'
import { LogsRoute } from '@/features/logs'
import { RiHistoryLine } from '@remixicon/react'

export default function LogsPage() {
  return (
    <div className="flex size-full flex-col">
      <PageHeader
        title="ログ"
        description="Askhubの利用ログを確認できます。"
        leftIcon={<RiHistoryLine />}
      />
      <div className="min-h-0 flex-1">
        <LogsRoute />
      </div>
    </div>
  )
}
