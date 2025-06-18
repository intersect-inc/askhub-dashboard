import useSWR, { SWRConfiguration } from 'swr'
import { z } from 'zod'

import { client } from '@/lib/api'

export const AssistantTemplateSection = z.object({
  uuid: z.string(),
  name: z.string(),
  display_order: z.number().optional().default(0),
})

export type AssistantTemplateSection = z.infer<typeof AssistantTemplateSection>

const GetAssistantTemplateSectionsResponse = z.object({
  sections: z.array(AssistantTemplateSection),
})

export type GetAssistantTemplateSectionsResponse = z.infer<
  typeof GetAssistantTemplateSectionsResponse
>

export const KEY = () => '/assistant_template_sections' as const

export const getAssistantTemplateSections = async () => {
  const response = await client.get<GetAssistantTemplateSectionsResponse>(KEY())
  return GetAssistantTemplateSectionsResponse.parse(response.data)
}

export const useAssistantTemplateSections = (
  options?: SWRConfiguration<GetAssistantTemplateSectionsResponse>
) => {
  return useSWR(KEY(), getAssistantTemplateSections, {
    ...options,
    shouldRetryOnError: false,
  })
}
