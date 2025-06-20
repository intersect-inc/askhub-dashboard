'use client'

import * as Badge from '@/components/ui/badge'
import * as Button from '@/components/ui/button'
import * as Divider from '@/components/ui/divider'
import { cn } from '@/utils/cn'
import { RiCloseLine } from '@remixicon/react'
import { useDrawerStore } from '../../store/useDrawerStore'
import { convertAction } from '../logTable'

export const MessageDrawer = () => {
  const { open, selectedMessage, setSelectedMessage } = useDrawerStore()

  return (
    <div
      className={cn(
        'bg-bg-base-0 shadow-lg h-full border-l border-stroke-soft-200 transition-all duration-200 ease-in-out',
        open ? 'w-[25vw] translate-x-0' : 'w-0 translate-x-full'
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 border-b border-stroke-soft-200 p-5">
          <h2 className="w-full text-label-lg">メッセージ詳細</h2>
          <Button.Root
            onClick={() => setSelectedMessage(null)}
            variant="neutral"
            mode="ghost"
            size="xxsmall"
          >
            <Button.Icon as={RiCloseLine} />
          </Button.Root>
        </div>
        <div className="overflow-y-auto custom-scroll-bar">
          {selectedMessage && (
            <>
              <Divider.Root variant="solid-text">ユーザー情報</Divider.Root>
              <div className="grid grid-cols-[auto_1fr] gap-x-3 p-5">
                <div className="row-span-2 size-10 rounded-full bg-primary-base" />
                <span className="text-paragraph-sm text-text-strong-950">
                  {selectedMessage.workspaceName}
                </span>
                <span className="text-paragraph-sm text-text-sub-600">
                  {selectedMessage.memberName}
                </span>
              </div>

              <Divider.Root variant="solid-text">送信日時</Divider.Root>
              <div className="flex flex-col gap-2 p-5">
                <span className="text-paragraph-sm text-text-strong-950">
                  {new Date(selectedMessage.message.createdAt).toLocaleString(
                    'ja-JP'
                  )}
                </span>
              </div>

              <Divider.Root variant="solid-text">アシスタント情報</Divider.Root>
              <div className="flex flex-col gap-3 p-5">
                <div className="flex flex-col gap-2">
                  <span className="text-label-sm text-text-sub-600">
                    アシスタント名
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-paragraph-sm text-text-strong-950">
                      {selectedMessage.assistantName}
                    </span>
                    <Badge.Root
                      size="small"
                      variant="light"
                      color={
                        selectedMessage.message.role === 'user'
                          ? 'blue'
                          : 'gray'
                      }
                    >
                      {selectedMessage.message.role}
                    </Badge.Root>
                  </div>
                </div>

                {selectedMessage.assistantDescription && (
                  <>
                    <Divider.Root variant="line-spacing" />
                    <div className="flex flex-col gap-2">
                      <span className="text-label-sm text-text-sub-600">
                        アシスタント説明
                      </span>
                      <span className="text-paragraph-sm text-text-strong-950">
                        {selectedMessage.assistantDescription}
                      </span>
                    </div>
                  </>
                )}

                {selectedMessage.assistantInstruction && (
                  <>
                    <Divider.Root variant="line-spacing" />
                    <div className="flex flex-col gap-2">
                      <span className="text-label-sm text-text-sub-600">
                        AIへの事前指示
                      </span>
                      <span className="text-paragraph-sm text-text-strong-950">
                        {selectedMessage.assistantInstruction}
                      </span>
                    </div>
                  </>
                )}
              </div>

              <Divider.Root variant="solid-text">
                モジュール/モデル
              </Divider.Root>
              <div className="flex items-center gap-2 p-5">
                <span className="text-paragraph-sm text-text-strong-950">
                  {convertAction(selectedMessage.action ?? 'その他')}
                </span>
                <Badge.Root
                  size="small"
                  variant="light"
                  color="gray"
                  className="w-fit"
                >
                  {selectedMessage.model}
                </Badge.Root>
              </div>

              <Divider.Root variant="solid-text">コンテンツ</Divider.Root>
              <div className="p-5">
                <span className="text-paragraph-sm text-text-strong-950">
                  {selectedMessage.message.content}
                </span>
              </div>

              {selectedMessage.message.references.length > 0 && (
                <>
                  <Divider.Root variant="solid-text">参照ファイル</Divider.Root>
                  <div className="flex flex-wrap gap-2 p-5">
                    {selectedMessage.message.references.map((reference) => (
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

              {selectedMessage.message.chatImages.length > 0 && (
                <>
                  <Divider.Root variant="solid-text">添付ファイル</Divider.Root>
                  <div className="space-y-2.5 px-5 py-3.5">
                    {selectedMessage.message.chatImages.map((image) => (
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}
