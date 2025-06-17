import useSWRMutation from 'swr/mutation'
import { z } from 'zod'

import { client } from '@/lib/api'

export const updateWorkspaceUsageLimitSchema = z.object({
  workspace_uuid: z.string(),
  usage_limit: z.number(),
})

export type UpdateWorkspaceUsageLimitRequest = z.infer<
  typeof updateWorkspaceUsageLimitSchema
>

export const updateWorkspaceUsageLimitResponseSchema = z.object({
  workspace_usage_limit_uuid: z.string(),
  usage_limit: z.number(),
})

export type UpdateWorkspaceUsageLimitResponse = z.infer<
  typeof updateWorkspaceUsageLimitResponseSchema
>

const KEY = 'admin/update_workspace_usage_limit'

const updateWorkspaceUsageLimit = async (
  request: UpdateWorkspaceUsageLimitRequest
) => {
  const response = await client.patch(KEY, request)
  return response.data
}

export const useUpdateWorkspaceUsageLimit = (options: {
  onSuccess: () => void
  onError: () => void
}) => {
  return useSWRMutation(
    KEY,
    (_, { arg }: { arg: UpdateWorkspaceUsageLimitRequest }) => {
      return updateWorkspaceUsageLimit(arg)
    },
    {
      onSuccess: options.onSuccess,
      onError: options.onError,
    }
  )
}
