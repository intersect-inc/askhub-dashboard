import { PageHeader } from '@/components/elements/page-header'
import { RiHistoryLine } from '@remixicon/react'

export default function LogsPage() {
  return (
    <div className="w-full">
      <PageHeader
        title="ログ"
        description="Askhubの利用ログを確認できます。"
        leftIcon={<RiHistoryLine />}
      />
    </div>
  )
}
