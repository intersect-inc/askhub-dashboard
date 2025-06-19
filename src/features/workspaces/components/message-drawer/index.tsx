'use client'

import * as Badge from '@/components/ui/badge'
import * as Divider from '@/components/ui/divider'
import * as Drawer from '@/components/ui/drawer'
import { AdminMessage } from '@/features/logs/api/getMessages'
import { convertAction } from '@/features/logs/components/logTable'

type MessageDrawerProps = {
  message: AdminMessage
  children: React.ReactNode
}

export const MessageDrawer = ({ message, children }: MessageDrawerProps) => {
  return (
    <Drawer.Root>
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>
      <Drawer.Content className="max-h-dvh overflow-hidden">
        <Drawer.Header>
          <Drawer.Title>メッセージの詳細</Drawer.Title>
        </Drawer.Header>
        <Drawer.Body>
          <Divider.Root variant="solid-text">ユーザー情報</Divider.Root>
          <div className="grid grid-cols-[auto_1fr] gap-x-3 p-5">
            <div className="row-span-2 size-10 rounded-full bg-primary-base" />
            <span className="text-paragraph-sm text-text-strong-950">
              {message.workspaceName}
            </span>
            <span className="text-paragraph-sm text-text-sub-600">
              {message.memberName}
            </span>
          </div>

          <Divider.Root variant="solid-text">送信日時</Divider.Root>
          <div className="flex flex-col gap-2 p-5">
            <span className="text-paragraph-sm text-text-strong-950">
              {new Date(message.message.createdAt).toLocaleString('ja-JP')}
            </span>
          </div>

          {/* FIXME: stgプッシュ用のコメント */}
          <Divider.Root variant="solid-text">アシスタント情報</Divider.Root>
          <div className="flex max-h-80 flex-col gap-3 overflow-y-auto p-5 custom-scroll-bar">
            <div className="flex flex-col gap-2">
              <span className="text-label-sm text-text-sub-600">
                アシスタント名
              </span>
              <div className="flex items-center gap-2">
                <span className="text-paragraph-sm text-text-strong-950">
                  {message.assistantName}
                </span>
                <Badge.Root
                  size="small"
                  variant="light"
                  color={message.message.role === 'user' ? 'blue' : 'gray'}
                >
                  {message.message.role}
                </Badge.Root>
              </div>
            </div>
            <Divider.Root variant="line-spacing" />
            <div className="flex flex-col gap-2">
              <span className="text-label-sm text-text-sub-600">
                アシスタント説明
              </span>
              <span className="text-paragraph-sm text-text-strong-950">
                {message.assistantDescription}
              </span>
            </div>
            <Divider.Root variant="line-spacing" />
            <div className="flex max-h-48 flex-col gap-2">
              <span className="text-label-sm text-text-sub-600">
                AIへの事前指示
              </span>
              <span className="text-paragraph-sm text-text-strong-950">
                {message.assistantInstruction}
              </span>
            </div>
          </div>

          <Divider.Root variant="solid-text">モジュール/モデル</Divider.Root>
          <div className="flex items-center gap-2 p-5">
            <span className="text-paragraph-sm text-text-strong-950">
              {convertAction(message.action ?? 'その他')}
            </span>
            <Badge.Root
              size="small"
              variant="light"
              color="gray"
              className="w-fit"
            >
              {message.model}
            </Badge.Root>
          </div>

          <Divider.Root variant="solid-text">コンテンツ</Divider.Root>
          <div className="max-h-96 overflow-y-auto p-5 custom-scroll-bar">
            <span className="text-paragraph-sm text-text-strong-950">
              {message.message.content}
            </span>
          </div>

          {message.message.references.length > 0 && (
            <>
              <Divider.Root variant="solid-text">参照ファイル</Divider.Root>

              <div className="flex flex-wrap gap-2 p-5">
                {message.message.references.map((reference) => (
                  <Badge.Root
                    key={reference.uuid}
                    size="small"
                    variant="light"
                    color="gray"
                  >
                    {reference.name}
                  </Badge.Root>
                ))}
              </div>
            </>
          )}

          {message.message.chatImages.length > 0 && (
            <>
              <Divider.Root variant="solid-text">添付ファイル</Divider.Root>

              <div className="space-y-2.5 px-5 py-3.5">
                {message.message.chatImages.map((image) => (
                  <Badge.Root
                    key={image.image}
                    size="small"
                    variant="light"
                    color="gray"
                  >
                    {image.image}
                  </Badge.Root>
                ))}
              </div>
            </>
          )}
        </Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  )
}
