'use client'

import * as Button from '@/components/ui/button'
import * as Checkbox from '@/components/ui/checkbox'
import * as Table from '@/components/ui/table'
import React, { useState } from 'react'
import { useUsers } from '../../api/getUsers'
import { AddCreditModal } from '../add-credit-modal'

type Props = {
  workspaceUuid: string
}

export const WorkspaceMemberTable = (props: Props) => {
  const { workspaceUuid } = props
  const { data } = useUsers()
  const [selectedMembers, setSelectedMembers] = useState<string[]>([])

  const members = data?.members.filter(
    (member) => member.workspaceUuid === workspaceUuid
  )

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedMembers([])
    } else {
      setSelectedMembers(
        members?.map((member) => member.workspaceMemberUuid) || []
      )
    }
  }

  // 個別選択の処理
  const handleSelectMember = (memberUuid: string, checked: boolean) => {
    if (checked) {
      setSelectedMembers((prev) => [...prev, memberUuid])
    } else {
      setSelectedMembers((prev) => prev.filter((uuid) => uuid !== memberUuid))
    }
  }

  // 選択されたメンバー情報を取得
  const selectedMemberData =
    members?.filter((member) =>
      selectedMembers.includes(member.workspaceMemberUuid)
    ) || []

  const isAllSelected =
    members && selectedMembers.length === members.length && members.length > 0
  const isIndeterminate =
    selectedMembers.length > 0 &&
    selectedMembers.length < (members?.length || 0)

  return (
    <div className="col-span-2 mt-4 flex flex-col gap-4">
      <div className="flex h-8 items-center justify-between">
        <p className="text-label-md text-text-strong-950">メンバー一覧</p>
        {selectedMembers.length > 0 && (
          <div className="flex items-center overflow-hidden rounded-lg border border-stroke-soft-200 pl-2.5">
            <span className="flex h-8 items-center border-r border-stroke-soft-200 pr-2 text-paragraph-xs text-primary-base">
              {selectedMembers.length}件選択済み
            </span>
            <AddCreditModal selectedMembers={selectedMemberData}>
              <Button.Root
                variant="neutral"
                mode="ghost"
                size="xxsmall"
                className="h-8 rounded-none"
              >
                一括追加
              </Button.Root>
            </AddCreditModal>
          </div>
        )}
      </div>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.Head className="w-10">
              <Checkbox.Root
                checked={isAllSelected || isIndeterminate ? true : false}
                data-state={
                  isIndeterminate
                    ? 'indeterminate'
                    : isAllSelected
                      ? 'checked'
                      : 'unchecked'
                }
                onCheckedChange={handleSelectAll}
              />
            </Table.Head>
            <Table.Head className="w-60">名前</Table.Head>
            <Table.Head>メールアドレス</Table.Head>
            <Table.Head className="w-32">クレジット追加</Table.Head>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {members?.map((member, index) => {
            const isSelected = selectedMembers.includes(
              member.workspaceMemberUuid
            )

            return (
              <React.Fragment key={member.workspaceMemberUuid}>
                <Table.Row className="cursor-pointer">
                  <Table.Cell>
                    <Checkbox.Root
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        handleSelectMember(
                          member.workspaceMemberUuid,
                          checked === true
                        )
                      }
                    />
                  </Table.Cell>
                  <Table.Cell className="text-label-sm text-text-strong-950">
                    {member.displayName}
                  </Table.Cell>
                  <Table.Cell className="text-paragraph-sm text-text-sub-600">
                    {member.email}
                  </Table.Cell>
                  <Table.Cell>
                    <AddCreditModal selectedMembers={[member]}>
                      <Button.Root
                        variant="neutral"
                        mode="stroke"
                        size="xsmall"
                        className="w-full"
                      >
                        追加する
                      </Button.Root>
                    </AddCreditModal>
                  </Table.Cell>
                </Table.Row>
                {index !== members.length - 1 && <Table.RowDivider />}
              </React.Fragment>
            )
          })}
        </Table.Body>
      </Table.Root>
    </div>
  )
}
