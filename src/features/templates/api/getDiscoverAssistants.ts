import useSWR, { SWRConfiguration } from 'swr'
import { z } from 'zod'

import { client } from '@/lib/api'
const Filter = z.object({
  query: z.string().optional(),
  is_my_assistant: z.boolean().optional(),
  is_default: z.boolean().optional(),
  category_uuid: z.string().optional(),
})

export type Filter = z.infer<typeof Filter>

const Sort = z.object({
  type: z.enum(['name', 'created_at', 'popularity']),
  direction: z.enum(['asc', 'desc']),
})

export type Sort = z.infer<typeof Sort>

export const DiscoverAssistantsRequest = z.object({
  filter: Filter.optional(),
  sort: Sort.optional(),
})

export type DiscoverAssistantsRequest = z.infer<
  typeof DiscoverAssistantsRequest
>

const Index = z.object({
  uuid: z.string(),
  name: z.string(),
  emoji: z.string(),
})

const Owner = z.object({
  uuid: z.string(),
  displayName: z.string().nullable().optional(),
  icon: z.string(),
})

export const DiscoverAssistant = z.object({
  uuid: z.string(),
  name: z.string(),
  description: z.string(),
  icon: z.string(),
  indexes: z.array(Index),
  owners: z.array(Owner),
  createdAt: z.string(),
  isMyAssistant: z.boolean(),
  isDefault: z.boolean(),
  messageCount: z.number(),
  assistantCategory: z.object({
    uuid: z.string().nullable(),
    name: z.string().nullable(),
  }),
})

export type DiscoverAssistant = z.infer<typeof DiscoverAssistant>

export const DiscoverAssistantsResponse = z.object({
  assistants: z.array(DiscoverAssistant),
})

export type DiscoverAssistantsResponse = z.infer<
  typeof DiscoverAssistantsResponse
>

export const KEY = (request?: DiscoverAssistantsRequest) => {
  const base = '/assistants/discover'
  if (!request) return base

  return [base, request] as const
}

export const getDiscoverAssistants = async (
  request?: DiscoverAssistantsRequest
) => {
  const response = await client.post('/assistants/discover', request)

  return DiscoverAssistantsResponse.parse(response.data)
}

export const mutateDiscoverAssistants = async (
  data?:
    | DiscoverAssistantsResponse
    | ((
        data: DiscoverAssistantsResponse | undefined
      ) => DiscoverAssistantsResponse | undefined)
) => {
  if (typeof data === 'function') {
    const currentData = await getDiscoverAssistants()
    return data(currentData)
  }
  const response = await getDiscoverAssistants()
  return response
}

export const useDiscoverAssistants = (
  request?: DiscoverAssistantsRequest,
  options?: SWRConfiguration<DiscoverAssistantsResponse>
) => {
  const { data, error, mutate } = useSWR(
    KEY(request),
    () => getDiscoverAssistants(request),
    options
  )

  return {
    data,
    error,
    isLoading: !error && !data,
    mutate: async () => {
      await mutate()
    },
  }
}
