import * as Table from '@/components/ui/table'
import React from 'react'
import { useUsers } from '../../api/getUsers'

type Props = {
  workspaceUuid: string
}

export const WorkspaceMemberTable = (props: Props) => {
  const { workspaceUuid } = props
  const { data } = useUsers()

  const members = data?.members.filter(
    (member) => member.workspaceUuid === workspaceUuid
  )

  return (
    <div className="col-span-2 mt-4 flex flex-col gap-4">
      <p className="text-label-md text-text-strong-950">メンバー一覧</p>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head className="w-60">名前</Table.Head>
            <Table.Head>メールアドレス</Table.Head>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {members?.map((member, index) => (
            <React.Fragment key={member.workspaceMemberUuid}>
              <Table.Row className="cursor-pointer">
                <Table.Cell className="text-label-sm text-text-strong-950">
                  {member.displayName}
                </Table.Cell>
                <Table.Cell className="text-paragraph-sm text-text-sub-600">
                  {member.email}
                </Table.Cell>
              </Table.Row>
              {index !== members.length - 1 && <Table.RowDivider />}
            </React.Fragment>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  )
}
