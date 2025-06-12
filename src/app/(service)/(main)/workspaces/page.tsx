import { PageHeader } from '@/components/elements/page-header'
import { RiGroupLine } from '@remixicon/react'

export default function WorkspacesPage() {
  return (
    <div className="w-full">
      <PageHeader
        title="ワークスペース一覧"
        description="ワークスペースごとの利用状況や設定を確認できます。"
        icon={<RiGroupLine className="text-text-sub-600" />}
      />
    </div>
  )
}
