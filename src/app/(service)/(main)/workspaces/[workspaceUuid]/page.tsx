'use client'

import { BreadcrumbPageHeader } from '@/components/elements/page-header'
import { useWorkspaces } from '@/features/workspaces/api/getWorkspaces'
import { WorkspaceDropdown } from '@/features/workspaces/components/workspace-dropdown'
import { WorksapceRoute } from '@/features/workspaces/routes/worksapce'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export default function WorkspacePage() {
  const { workspaceUuid } = useParams()
  const { data } = useWorkspaces()

  const workspaceName = data?.workspaces.find(
    (workspace) => workspace.workspaceUuid === workspaceUuid
  )?.name

  return (
    <div className="flex h-full flex-col gap-6">
      <BreadcrumbPageHeader
        breadcrumbItems={[
          <Link
            href="/workspaces"
            key="workspaces"
            className="text-label-md text-text-sub-600 hover:underline"
          >
            ワークスペース一覧
          </Link>,
          <span
            key="workspace-name"
            className="text-label-md text-text-strong-950"
          >
            {workspaceName}
          </span>,
        ]}
      >
        <WorkspaceDropdown workspaceUuid={workspaceUuid as string} />
      </BreadcrumbPageHeader>
      <div className="min-h-0 flex-1 overflow-auto custom-scroll-bar">
        <WorksapceRoute workspaceUuid={workspaceUuid as string} />
      </div>
    </div>
  )
}
