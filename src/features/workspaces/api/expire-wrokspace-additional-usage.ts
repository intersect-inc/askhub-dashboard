import useSWRMutation from 'swr/mutation'
import { z } from 'zod'

import { client } from '@/lib/api'

export const expireWorkspaceAdditionalCreditSchema = z.object({
  workspace_uuid: z.string(),
})

export type ExpireWorkspaceAdditionalCreditRequest = z.infer<
  typeof expireWorkspaceAdditionalCreditSchema
>

export const expireWorkspaceAdditionalCreditResponseSchema = z.object({
  expired_count: z.number(),
})

export type ExpireWorkspaceAdditionalCreditResponse = z.infer<
  typeof expireWorkspaceAdditionalCreditResponseSchema
>

const KEY = 'admin/expire_workspace_additional_credits'

const expireWorkspaceAdditionalCredit = async (
  request: ExpireWorkspaceAdditionalCreditRequest
) => {
  const response = await client.post(KEY, request)
  return response.data
}

export const useExpireWorkspaceAdditionalCredit = () => {
  return useSWRMutation(
    KEY,
    (_, { arg }: { arg: ExpireWorkspaceAdditionalCreditRequest }) => {
      return expireWorkspaceAdditionalCredit(arg)
    }
  )
}
