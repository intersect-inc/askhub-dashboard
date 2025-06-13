'use client'

import * as Table from '@/components/ui/table'
import { AdminMessage } from '../../api/getMessages'

export const LogTable = ({ messages }: { messages: AdminMessage[] }) => {
  return (
    <div style={{ height: 'calc(100% - 0.5rem)' }}>
      <Table.Root className="mx-8 h-full !overflow-auto">
        <Table.Header>
          <Table.Row>
            <Table.Head>
              <div className="flex min-w-80 items-center gap-0.5">
                ワークスペース
              </div>
            </Table.Head>
            <Table.Head>
              <div className="flex min-w-32 items-center gap-0.5">メンバー</div>
            </Table.Head>
            <Table.Head>
              <div className="flex min-w-24 items-center gap-0.5">ロール</div>
            </Table.Head>
            <Table.Head>
              <div className="flex min-w-[300px] items-center gap-0.5">
                内容
              </div>
            </Table.Head>
            <Table.Head>
              <div className="flex min-w-48 items-center gap-0.5">作成日時</div>
            </Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {messages.map((message) => (
            <Table.Row key={message.message.uuid}>
              <Table.Cell>
                <div className="truncate">{message.workspaceName}</div>
              </Table.Cell>
              <Table.Cell>
                <div className="truncate">{message.memberName}</div>
              </Table.Cell>
              <Table.Cell>
                <div className="truncate">{message.message.role}</div>
              </Table.Cell>
              <Table.Cell>
                <div className="truncate text-paragraph-xs">
                  {message.message.content}
                </div>
              </Table.Cell>
              <Table.Cell>
                <div className="truncate">
                  {new Date(message.message.createdAt).toLocaleString('ja-JP')}
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  )
}
