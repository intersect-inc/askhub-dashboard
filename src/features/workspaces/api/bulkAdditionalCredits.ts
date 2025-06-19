import useSWRMutation from 'swr/mutation'
import { z } from 'zod'

import { client } from '@/lib/api'

// Email-based bulk credits (既存のAPI)
export const BulkCreateAdditionalCreditsRequestSchema = z.object({
  email_credit_list: z
    .array(z.tuple([z.string().email(), z.number().positive()]))
    .max(100),
})

const BulkCreateResultItemSchema = z.object({
  email: z.string(),
  status: z.enum(['success', 'failed']),
  additional_credit_uuid: z.string().nullable(),
  error: z.string().nullable(),
})

const BulkCreateAdditionalCreditsResponseSchema = z.object({
  success_count: z.number(),
  failed_count: z.number(),
  results: z.array(BulkCreateResultItemSchema),
})

export type BulkCreateAdditionalCreditsRequest = z.infer<
  typeof BulkCreateAdditionalCreditsRequestSchema
>
export type BulkCreateAdditionalCreditsResponse = z.infer<
  typeof BulkCreateAdditionalCreditsResponseSchema
>

// Workspace member-based bulk credits (新しいAPI)
export const WorkspaceMemberCreditRequestSchema = z.object({
  workspace_member_credit_list: z
    .array(
      z.object({
        workspace_member_uuid: z
          .string()
          .min(1, 'ワークスペースメンバーUUIDが必要です'),
        additional_credits: z
          .number()
          .min(1, '追加クレジットは1以上である必要があります'),
      })
    )
    .min(1, '少なくとも1つのメンバーが必要です')
    .max(100, '一度に処理できるメンバーは100人までです'),
})

const WorkspaceMemberCreditResultItemSchema = z.object({
  workspace_member_uuid: z.string(),
  status: z.enum(['success', 'failed']),
  additional_credit_uuid: z.string().nullable(),
  error: z.string().nullable(),
})

const WorkspaceMemberCreditResponseSchema = z.object({
  success_count: z.number(),
  failed_count: z.number(),
  results: z.array(WorkspaceMemberCreditResultItemSchema),
})

export type WorkspaceMemberCreditRequest = z.infer<
  typeof WorkspaceMemberCreditRequestSchema
>
export type WorkspaceMemberCreditResponse = z.infer<
  typeof WorkspaceMemberCreditResponseSchema
>

// Email-based API関数 (既存)
export const bulkCreateAdditionalCredits = async (
  emailCreditList: [string, number][]
): Promise<BulkCreateAdditionalCreditsResponse> => {
  const requestData = { email_credit_list: emailCreditList }

  const response = await client.post<BulkCreateAdditionalCreditsResponse>(
    '/admin/bulk_create_additional_credits',
    requestData
  )

  return BulkCreateAdditionalCreditsResponseSchema.parse(response.data)
}

// Workspace member-based API関数 (新しい)
export const bulkAddWorkspaceMemberCredits = async (
  data: WorkspaceMemberCreditRequest
): Promise<WorkspaceMemberCreditResponse> => {
  const validatedData = WorkspaceMemberCreditRequestSchema.parse(data)

  const response = await client.post<WorkspaceMemberCreditResponse>(
    '/workspaces/members/bulk-additional-credits',
    validatedData
  )

  return WorkspaceMemberCreditResponseSchema.parse(response.data)
}

// 便利なヘルパー関数: 複数メンバーに同じクレジット追加
export const addCreditsToMembers = async (
  members: Array<{ workspaceMemberUuid: string; credits: number }>
): Promise<WorkspaceMemberCreditResponse> => {
  return bulkAddWorkspaceMemberCredits({
    workspace_member_credit_list: members.map((member) => ({
      workspace_member_uuid: member.workspaceMemberUuid,
      additional_credits: member.credits,
    })),
  })
}

// SWR Mutationフック (既存のemail-based)
export const useBulkCreateAdditionalCredits = () => {
  return useSWRMutation(
    ['bulkCreateAdditionalCredits'],
    (_, { arg }: { arg: { emailCreditList: [string, number][] } }) => {
      return bulkCreateAdditionalCredits(arg.emailCreditList)
    }
  )
}

// SWR Mutationフック (新しいworkspace member-based)
export const useBulkAddWorkspaceMemberCredits = () => {
  return useSWRMutation(
    ['bulkAddWorkspaceMemberCredits'],
    (_, { arg }: { arg: WorkspaceMemberCreditRequest }) => {
      return bulkAddWorkspaceMemberCredits(arg)
    }
  )
}
