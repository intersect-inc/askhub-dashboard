import { mutate } from 'swr'
import useSWRMutation from 'swr/mutation'
import { z } from 'zod'

import { client } from '@/lib/api'

// ワークスペース作成用のスキーマ定義
export const CreateWorkspaceSchema = z.object({
  name: z.string().min(1, { message: 'ワークスペース名を入力してください' }),
  usageLimit: z.number().min(0, { message: '使用制限を設定してください' }),
  emails: z
    .array(
      z.string().email({ message: '有効なメールアドレスを入力してください' })
    )
    .optional(),
})

export type CreateWorkspaceSchema = z.infer<typeof CreateWorkspaceSchema>

const CreateWorkspaceResponse = z.object({
  workspaceUuid: z.string(),
})

export type CreateWorkspaceResponse = z.infer<typeof CreateWorkspaceResponse>

export const createWorkspace = async (
  values: CreateWorkspaceSchema
): Promise<CreateWorkspaceResponse> => {
  CreateWorkspaceSchema.parse(values)
  const response = await client.post<CreateWorkspaceResponse>(
    '/admin/create_workspace',
    {
      name: values.name,
      usage_limit: values.usageLimit,
      emails: values.emails,
    }
  )

  if (response.data) {
    await mutate('/admin/workspaces')
  }

  return CreateWorkspaceResponse.parse(response.data)
}

export const useCreateWorkspace = (options?: {
  onSuccess?: (data: CreateWorkspaceResponse) => void
  onError?: () => void
}) => {
  return useSWRMutation(
    ['createWorkspace'],
    (_, { arg }: { arg: { values: CreateWorkspaceSchema } }) => {
      return createWorkspace(arg.values)
    },
    {
      revalidate: false,
      ...options,
    }
  )
}
