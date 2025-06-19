'use client'

import * as Table from '@/components/ui/table'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useWorkspaces } from '../api/getWorkspaces'

export const WorkspacesRoute = () => {
  const { data } = useWorkspaces()
  const router = useRouter()
  return (
    <div className="flex h-full flex-col overflow-auto custom-scroll-bar">
      <div className="flex-1 p-8 pt-0">
        <Table.Root>
          <Table.Header>
            <Table.Row>
              <Table.Head>ワークスペース名</Table.Head>
              <Table.Head>UUID</Table.Head>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {data?.workspaces?.map((workspace, index) => (
              <React.Fragment key={workspace.workspaceUuid}>
                <Table.Row
                  className="cursor-pointer"
                  onClick={() => {
                    router.push(`/workspaces/${workspace.workspaceUuid}`)
                  }}
                >
                  <Table.Cell className="text-label-sm text-text-strong-950">
                    {workspace.name}
                  </Table.Cell>
                  <Table.Cell className="text-paragraph-sm text-text-sub-600">
                    {workspace.workspaceUuid}
                  </Table.Cell>
                </Table.Row>
                {index !== data.workspaces.length - 1 && <Table.RowDivider />}
              </React.Fragment>
            ))}
          </Table.Body>
        </Table.Root>
      </div>
    </div>
  )
}
