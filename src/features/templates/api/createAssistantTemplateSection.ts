import { z } from 'zod'

import { client } from '@/lib/api'

const CreateAssistantTemplateSectionRequest = z.object({
  name: z.string(),
})

export type CreateAssistantTemplateSectionRequest = z.infer<
  typeof CreateAssistantTemplateSectionRequest
>

const CreateAssistantTemplateSectionResponse = z.object({
  sectionUuid: z.string(),
})

export type CreateAssistantTemplateSectionResponse = z.infer<
  typeof CreateAssistantTemplateSectionResponse
>

export const createAssistantTemplateSection = async (
  request: CreateAssistantTemplateSectionRequest
) => {
  const response = await client.post<CreateAssistantTemplateSectionResponse>(
    '/assistant_template_sections',
    request
  )
  return CreateAssistantTemplateSectionResponse.parse(response.data)
}
