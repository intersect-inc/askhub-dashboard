import { z } from 'zod'

import { client } from '@/lib/api'

const AssistantSectionPair = z.object({
  assistant_uuid: z.string(),
  template_section_uuid: z.string(),
})

export type AssistantSectionPair = z.infer<typeof AssistantSectionPair>

const CreateAssistantTemplatesRequest = z.object({
  assistant_templates: z.array(AssistantSectionPair),
})

export type CreateAssistantTemplatesRequest = z.infer<
  typeof CreateAssistantTemplatesRequest
>

const AssistantTemplateCreated = z.object({
  assistantUuid: z.string(),
  templateSectionUuid: z.string(),
  assistantTemplateUuid: z.string(),
})

export type AssistantTemplateCreated = z.infer<typeof AssistantTemplateCreated>

const CreateAssistantTemplatesResponse = z.object({
  assistantTemplates: z.array(AssistantTemplateCreated),
})

export type CreateAssistantTemplatesResponse = z.infer<
  typeof CreateAssistantTemplatesResponse
>

export const createAssistantTemplatesFromAssistants = async (
  request: CreateAssistantTemplatesRequest
) => {
  const response = await client.post<CreateAssistantTemplatesResponse>(
    '/assistant_templates/from-assistants',
    request
  )
  return CreateAssistantTemplatesResponse.parse(response.data)
}
