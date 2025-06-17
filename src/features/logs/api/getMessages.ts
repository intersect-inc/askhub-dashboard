'use client'

import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'
import { z } from 'zod'

import { AIModel, ActionType, FileType } from '@/features/types'
import { client } from '@/lib/api'

export type { MessageRole }

// スキーマ定義
const MessageRole = z.enum(['user', 'assistant', 'system', 'tool'])

const FileSchema = z.object({
  uuid: z.string(),
  name: z.string(),
  type: FileType,
  image: z.string().nullable().optional(),
})

const ChatImageSchema = z.object({
  image: z.string(),
  mime_type: z.string().nullable().optional(),
})

const GeneratedImageSchema = z.object({
  image: z.string(),
  prompt: z.string().nullable().optional(),
})

const MessageSchema = z.object({
  uuid: z.string(),
  taskUuid: z.string().nullable(),
  statusMessage: z.string().nullable(),
  role: MessageRole,
  content: z.string(),
  action: ActionType.nullable(),
  model: z.string().nullable(),
  reaction: z.string().nullable(),
  createdAt: z.string(),
  references: z.array(FileSchema),
  generatedFiles: z.array(z.any()),
  chatImages: z.array(ChatImageSchema),
  generatedImage: GeneratedImageSchema.nullable(),
  reasoning: z.string().nullable(),
})

const AdminMessageSchema = z.object({
  message: MessageSchema,
  workspaceName: z.string(),
  memberName: z.string(),
  assistantName: z.string(),
  assistantDescription: z.string(),
  assistantInstruction: z.string(),
  action: ActionType.nullable(),
  model: AIModel.nullable(),
})

const AdminMessageListResponse = z.object({
  messages: z.array(AdminMessageSchema),
})

// 型の出力
export type MessageRole = z.infer<typeof MessageRole>
export type AdminMessage = z.infer<typeof AdminMessageSchema>
export type AdminMessageListResponse = z.infer<typeof AdminMessageListResponse>

// フェッチャー関数
const messagesFetcher = async (
  url: string
): Promise<AdminMessageListResponse> => {
  const response = await client.get<AdminMessageListResponse>(url)
  return AdminMessageListResponse.parse(response.data)
}

export const useMessages = (
  page: number,
  workspaceUuid?: string,
  userUuid?: string,
  role?: MessageRole
) => {
  const params: Record<string, string> = {
    ...(workspaceUuid && { workspace_uuid: workspaceUuid }),
    ...(userUuid && { workspace_member_uuid: userUuid }),
    ...(role && { message_role: role }),
  }

  // キーにpageを含めることで、ページが変更されたときに再フェッチが行われます
  const queryString = new URLSearchParams(params).toString()
  const key = queryString
    ? `admin/messages/${page}?${queryString}`
    : `admin/messages/${page}`

  return useSWR<AdminMessageListResponse>(key, messagesFetcher, {
    revalidateOnFocus: false,
  })
}

export const useInfiniteMessages = (
  workspaceUuid?: string,
  userUuid?: string,
  role?: MessageRole
) => {
  const params: Record<string, string> = {
    ...(workspaceUuid && { workspace_uuid: workspaceUuid }),
    ...(userUuid && { workspace_member_uuid: userUuid }),
    ...(role && { message_role: role }),
  }

  const queryString = new URLSearchParams(params).toString()

  const getKey = (
    pageIndex: number,
    previousPageData: AdminMessageListResponse | null
  ) => {
    // 最初のページ
    if (pageIndex === 0) {
      return queryString
        ? `admin/messages/1?${queryString}`
        : 'admin/messages/1'
    }

    // 前のページのデータがない場合は終了
    if (previousPageData && !previousPageData.messages.length) return null

    // 次のページ
    const page = pageIndex + 1
    return queryString
      ? `admin/messages/${page}?${queryString}`
      : `admin/messages/${page}`
  }

  return useSWRInfinite<AdminMessageListResponse>(getKey, messagesFetcher, {
    revalidateOnFocus: false,
    revalidateFirstPage: false,
  })
}
