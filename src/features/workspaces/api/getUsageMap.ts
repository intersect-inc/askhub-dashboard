import { SWRConfiguration } from 'swr'
import useSWR from 'swr/immutable'
import { z } from 'zod'

import { client } from '@/lib/api'

const GetUsageMapRequest = z.object({
  workspaceUuid: z.string().optional(),
  yearMonth: z.string().optional(),
})

type GetUsageMapRequest = z.infer<typeof GetUsageMapRequest>

const UsageCountRange = z.object({
  rangeName: z.string(),
  memberCount: z.number(),
})

const WorkspaceUsageMap = z.object({
  workspaceUuid: z.string(),
  workspaceName: z.string(),
  usageCounts: z.array(UsageCountRange),
})

const GetUsageMapResponse = z.object({
  workspaces: z.array(WorkspaceUsageMap),
})

export type GetUsageMapResponse = z.infer<typeof GetUsageMapResponse>

const KEY = (params?: { workspaceUuid?: string; yearMonth?: string }) => {
  const query = new URLSearchParams()

  if (params?.workspaceUuid) {
    query.append('workspace_uuid', params.workspaceUuid)
  }
  if (params?.yearMonth) {
    query.append('year_month', params.yearMonth)
  }

  const queryString = query.toString()
  return `/admin/get_usage_map${queryString ? `?${queryString}` : ''}`
}

const getUsageMap = async (params?: GetUsageMapRequest) => {
  const res = await client.get<GetUsageMapResponse>(KEY(params))
  return res.data
}

export const useGetUsageMap = (
  params?: { workspaceUuid?: string; yearMonth?: string },
  options?: SWRConfiguration<GetUsageMapResponse>
) => {
  return useSWR(KEY(params), () => getUsageMap(params), {
    ...options,
    shouldRetryOnError: false,
  })
}
