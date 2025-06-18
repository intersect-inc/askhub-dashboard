import { z } from 'zod'

import { client } from '@/lib/api'

const DeleteAssistantTemplateSectionResponse = z.object({
  success: z.boolean(),
})

export type DeleteAssistantTemplateSectionResponse = z.infer<
  typeof DeleteAssistantTemplateSectionResponse
>

export const deleteAssistantTemplateSection = async (sectionUuid: string) => {
  const response = await client.delete<DeleteAssistantTemplateSectionResponse>(
    `/assistant_template_sections/${sectionUuid}`
  )
  return DeleteAssistantTemplateSectionResponse.parse(response.data)
}
