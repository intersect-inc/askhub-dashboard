import useSWR, { SWRConfiguration } from 'swr'
import { z } from 'zod'

import { client } from '@/lib/api'

const Filter = z.object({
  query: z.string().optional(),
  section_uuid: z.string().optional(),
})

export type Filter = z.infer<typeof Filter>

const Sort = z.object({
  type: z.enum(['name', 'created_at']),
  direction: z.enum(['asc', 'desc']),
})

export type Sort = z.infer<typeof Sort>

export const DiscoverAssistantTemplatesRequest = z.object({
  filter: Filter.optional(),
  sort: Sort.optional(),
})

export type DiscoverAssistantTemplatesRequest = z.infer<
  typeof DiscoverAssistantTemplatesRequest
>

export const AssistantTemplate = z.object({
  uuid: z.string(),
  name: z.string(),
  icon: z.string().nullable(),
  sectionUuid: z.string(),
  sectionName: z.string().nullable(),
  description: z.string().nullable(),
  createdAt: z.string(),
})

export type AssistantTemplate = z.infer<typeof AssistantTemplate>

export const DiscoverAssistantTemplatesResponse = z.object({
  templates: z.array(AssistantTemplate),
})

export type DiscoverAssistantTemplatesResponse = z.infer<
  typeof DiscoverAssistantTemplatesResponse
>

export const KEY = (request?: DiscoverAssistantTemplatesRequest) => {
  const base = '/assistant_templates/discover'
  if (!request) return base

  return [base, request] as const
}

export const getDiscoverAssistantTemplates = async (
  request?: DiscoverAssistantTemplatesRequest
) => {
  const response = await client.post('/assistant_templates/discover', request)
  return DiscoverAssistantTemplatesResponse.parse(response.data)
}

export const mutateDiscoverAssistantTemplates = async (
  data?:
    | DiscoverAssistantTemplatesResponse
    | ((
        data: DiscoverAssistantTemplatesResponse | undefined
      ) => DiscoverAssistantTemplatesResponse | undefined)
) => {
  if (typeof data === 'function') {
    const currentData = await getDiscoverAssistantTemplates()
    return data(currentData)
  }
  const response = await getDiscoverAssistantTemplates()
  return response
}

export const useDiscoverAssistantTemplates = (
  request?: DiscoverAssistantTemplatesRequest,
  options?: SWRConfiguration<DiscoverAssistantTemplatesResponse>
) => {
  const { data, error, mutate } = useSWR(
    KEY(request),
    () => getDiscoverAssistantTemplates(request),
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
