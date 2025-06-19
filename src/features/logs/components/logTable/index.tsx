'use client'

import * as Badge from '@/components/ui/badge'
import * as Divider from '@/components/ui/divider'
import * as Table from '@/components/ui/table'
import { MessageDrawer } from '@/features/workspaces/components/message-drawer'
import { formatISODateTime } from '@/utils/time'
import { RiLoader2Fill } from '@remixicon/react'
import React, { useCallback, useEffect, useRef } from 'react'
import { MessageRole, useInfiniteMessages } from '../../api/getMessages'

export const convertAction = (action: string) => {
  switch (action) {
    case 'CHAT':
      return 'チャット'
    case 'BROWSE':
      return 'Web検索'
    case 'REGENERATE':
      return '再生成'
    case 'SEARCH':
      return 'ナレッジ検索'
    case 'GENERATE_IMAGE':
      return '画像生成'
    case 'REASONING':
      return '推論'
    case 'CODE_INTERPRETER':
      return 'コード実行'
    case 'AGENT':
      return 'エージェント'
    case 'TRANSCRIBE':
      return '文字起こし'
    default:
      return action
  }
}

export const LogTable = ({
  workspaceUuid,
  userUuid,
  role,
}: {
  workspaceUuid?: string
  userUuid?: string
  role?: MessageRole
}) => {
  const { data, size, setSize, isValidating, isLoading, error } =
    useInfiniteMessages(workspaceUuid, userUuid, role)

  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // 全てのメッセージを統合
  const allMessages = data ? data.flatMap((page) => page.messages) : []

  // 次のページを読み込む関数
  const loadMore = useCallback(() => {
    if (!isLoading && !isValidating) {
      setSize(size + 1)
    }
  }, [isLoading, isValidating, setSize, size])

  // スクロール検知
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container
      const remaining = scrollHeight - scrollTop - clientHeight

      // 残り100px以下になったら次のページを読み込み
      if (remaining < 100 && !isLoading && !isValidating) {
        loadMore()
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [loadMore, size, isLoading, isValidating, allMessages.length])

  // データロード後の初期チェック
  useEffect(() => {
    if (data && data.length > 0) {
      const container = scrollContainerRef.current
      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container
        const remaining = scrollHeight - scrollTop - clientHeight

        // コンテンツが少ない場合は自動的に次のページを読み込み
        if (remaining < 100 && !isLoading && !isValidating) {
          loadMore()
        }
      }
    }
  }, [data, loadMore, isLoading, isValidating])

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <span className="text-error-base">
          エラーが発生しました: {error.message}
        </span>
      </div>
    )
  }

  if (isLoading)
    return (
      <div className="flex h-full flex-col gap-3 px-8">
        <div className="h-9 w-full rounded-lg bg-bg-weak-50" />
        <div className="flex flex-col">
          <div className="h-16 w-full animate-pulse rounded-lg bg-bg-weak-50" />
          <Divider.Root className="my-2" />
          <div className="h-16 w-full animate-pulse rounded-lg bg-bg-weak-50" />
          <Divider.Root className="my-2" />
          <div className="h-16 w-full animate-pulse rounded-lg bg-bg-weak-50" />
          <Divider.Root className="my-2" />
          <div className="h-16 w-full animate-pulse rounded-lg bg-bg-weak-50" />
          <Divider.Root className="my-2" />
          <div className="h-16 w-full animate-pulse rounded-lg bg-bg-weak-50" />
        </div>
      </div>
    )

  return (
    <div className="flex h-full flex-col">
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-auto custom-scroll-bar"
      >
        <div className="pl-8">
          <Table.Root style={{ tableLayout: 'fixed', width: '100%' }}>
            <Table.Header>
              <Table.Row>
                <Table.Head className="w-28 text-label-sm">送信日時</Table.Head>
                <Table.Head className="w-36 text-label-sm">ユーザー</Table.Head>
                <Table.Head className="w-44 text-label-sm">
                  アシスタント
                </Table.Head>
                <Table.Head className="w-44 text-label-sm">
                  モジュール/モデル
                </Table.Head>
                <Table.Head className="w-[1016px] text-label-sm">
                  コンテンツ
                </Table.Head>
                <Table.Head className="w-36 text-label-sm">
                  参照ファイル
                </Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {isLoading && (
                <Table.Row>
                  <Table.Cell colSpan={6}>
                    <div className="flex h-full items-center justify-center">
                      <RiLoader2Fill className="size-6 animate-spin text-text-sub-600" />
                    </div>
                  </Table.Cell>
                </Table.Row>
              )}
              {allMessages.map((message) => (
                <React.Fragment key={message.message.uuid}>
                  <MessageDrawer message={message}>
                    <Table.Row className="cursor-pointer">
                      <Table.Cell className="text-paragraph-sm text-text-strong-950">
                        <div className="flex flex-col overflow-hidden">
                          <span>
                            {
                              formatISODateTime(
                                message.message.createdAt
                              ).split(' ')[0]
                            }
                          </span>
                          <span>
                            {
                              formatISODateTime(
                                message.message.createdAt
                              ).split(' ')[1]
                            }
                          </span>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="text-paragraph-sm">
                        <div className="flex flex-col overflow-hidden truncate">
                          <span className="truncate text-paragraph-sm text-text-strong-950">
                            {message.workspaceName}
                          </span>
                          <span className="truncate text-paragraph-sm text-text-strong-950">
                            {message.memberName}
                          </span>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="truncate text-paragraph-sm">
                        <div className="flex flex-col gap-1 overflow-hidden">
                          <span className="truncate text-paragraph-sm text-text-strong-950">
                            {message.assistantName}
                          </span>
                          <Badge.Root
                            size="small"
                            variant="light"
                            color={
                              message.message.role === 'user' ? 'blue' : 'gray'
                            }
                            className="w-fit"
                          >
                            {message.message.role}
                          </Badge.Root>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="text-paragraph-sm">
                        <div className="flex flex-col gap-1 overflow-hidden truncate">
                          <span className="truncate text-label-sm text-text-strong-950">
                            {convertAction(message.message.action ?? 'その他')}
                          </span>
                          <span className="truncate text-paragraph-xs text-text-strong-950">
                            {message.model}
                          </span>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="text-paragraph-sm text-text-strong-950">
                        <div className="overflow-hidden truncate">
                          {message.message.content}
                        </div>
                      </Table.Cell>
                      <Table.Cell className="text-paragraph-sm">
                        <div className="flex flex-col gap-1 overflow-hidden">
                          {message.message.references
                            .slice(0, 2)
                            .map((reference) => (
                              <Badge.Root
                                key={reference.uuid}
                                size="small"
                                variant="light"
                                color="gray"
                                className="w-full truncate"
                              >
                                {reference.name}
                              </Badge.Root>
                            ))}
                          {message.message.references.length > 2 && (
                            <Badge.Root
                              size="small"
                              variant="light"
                              color="gray"
                              className="w-full truncate"
                            >
                              他{message.message.references.length - 2}件
                            </Badge.Root>
                          )}
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  </MessageDrawer>

                  <Table.RowDivider colSpan={6} />
                </React.Fragment>
              ))}
              {isValidating && (
                <Table.Row>
                  <Table.Cell colSpan={7}>
                    <div className="flex h-full items-center justify-center">
                      <RiLoader2Fill className="size-6 animate-spin text-text-sub-600" />
                    </div>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table.Root>
        </div>
      </div>
    </div>
  )
}
