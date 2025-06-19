import useSWR, { SWRConfiguration, mutate as globalMutate } from 'swr'
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
  const requestBody = {
    filter: request?.filter || {},
    sort: request?.sort,
  }
  const response = await client.post(
    '/assistant_templates/discover',
    requestBody
  )
  return DiscoverAssistantTemplatesResponse.parse(response.data)
}

export const mutateDiscoverAssistantTemplates = async () => {
  const newData = await getDiscoverAssistantTemplates()
  await globalMutate(['/assistant_templates/discover'], newData, false)
  return newData
}

export const useDiscoverAssistantTemplates = (
  request?: DiscoverAssistantTemplatesRequest,
  options?: SWRConfiguration<DiscoverAssistantTemplatesResponse>
) => {
  const { data, error, mutate } = useSWR(
    ['/assistant_templates/discover'],
    () => getDiscoverAssistantTemplates(request),
    {
      ...options,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  )

  return {
    data,
    error,
    isLoading: !error && !data,
    mutate,
  }
}
