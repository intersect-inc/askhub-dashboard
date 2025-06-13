'use client'

import { BreadcrumbPageHeader } from '@/components/elements/page-header'
import { useWorkspaces } from '@/features/workspaces/api/getWorkspaces'
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
    <div className="size-full">
      <BreadcrumbPageHeader
        breadcrumbItems={[
          <Link href="/workspaces" key="workspaces">
            ワークスペース一覧
          </Link>,
          <span key="workspace-name">{workspaceName}</span>,
        ]}
      />
      <WorksapceRoute workspaceUuid={workspaceUuid as string} />
    </div>
  )
}
