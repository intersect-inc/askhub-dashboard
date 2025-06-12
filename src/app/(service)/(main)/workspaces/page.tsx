import { PageHeader } from '@/components/elements/page-header'
import { WorkspacesRoute } from '@/features/workspaces'
import { CreateWorkspaceModal } from '@/features/workspaces/components/create-workspace-modal'
import { RiGroupLine } from '@remixicon/react'

export default function WorkspacesPage() {
  return (
    <div className="flex w-full flex-col gap-6">
      <PageHeader
        title="ワークスペース一覧"
        description="ワークスペースごとの利用状況や設定を確認できます。"
        leftIcon={<RiGroupLine className="text-text-sub-600" />}
      >
        <CreateWorkspaceModal />
      </PageHeader>
      <WorkspacesRoute />
    </div>
  )
}
