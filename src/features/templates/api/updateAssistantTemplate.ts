import { z } from 'zod'

import { mutateDiscoverAssistantTemplates } from '@/features/templates/api/getDiscoverAssistantTemplates'
import { client } from '@/lib/api'

export const UpdateAssistantTemplateRequest = z.object({
  name: z.string(),
  section_uuid: z.string(),
})

export type UpdateAssistantTemplateRequest = z.infer<
  typeof UpdateAssistantTemplateRequest
>

const UpdateAssistantTemplateResponse = z.object({
  success: z.boolean(),
  uuid: z.string(),
})

export type UpdateAssistantTemplateResponse = z.infer<
  typeof UpdateAssistantTemplateResponse
>

/**
 * アシスタントテンプレートを更新するAPI
 * @param templateUuid 更新するアシスタントテンプレートのUUID
 * @param request 更新内容（名前とセクションUUID）
 * @param shouldMutate 更新後にテンプレート一覧を自動更新するかどうか（デフォルト：true）
 * @returns 更新操作の結果 (success: true/false, uuid: string)
 * @throws 404 - テンプレートが見つからない場合
 * @throws 500 - サーバーエラーが発生した場合
 */
export const updateAssistantTemplate = async (
  templateUuid: string,
  request: UpdateAssistantTemplateRequest,
  shouldMutate = true
) => {
  try {
    // リクエストの内容をログ出力
    const requestBody = {
      name: request.name,
      section_uuid: request.section_uuid,
    }

    // 更新APIを呼び出し
    const response = await client.put<UpdateAssistantTemplateResponse>(
      `/assistant_templates/${templateUuid}`,
      requestBody
    )

    // 更新成功後、必要に応じてリストを更新
    if (shouldMutate) {
      await mutateDiscoverAssistantTemplates()
    }

    return UpdateAssistantTemplateResponse.parse(response.data)
  } catch (error) {
    throw error
  }
}
