import { z } from 'zod'

import { mutateDiscoverAssistantTemplates } from '@/features/templates/api/getDiscoverAssistantTemplates'
import { client } from '@/lib/api'

const DeleteAssistantTemplateResponse = z.object({
  success: z.boolean(),
})

export type DeleteAssistantTemplateResponse = z.infer<
  typeof DeleteAssistantTemplateResponse
>

/**
 * アシスタントテンプレートを削除するAPI
 * @param templateUuid 削除するアシスタントテンプレートのUUID
 * @param shouldMutate 削除後にテンプレート一覧を自動更新するかどうか（デフォルト：true）
 * @returns 削除操作の結果 (success: true/false)
 * @throws 404 - テンプレートが見つからない場合
 * @throws 500 - サーバーエラーが発生した場合
 */
export const deleteAssistantTemplate = async (
  templateUuid: string,
  shouldMutate = true
) => {
  // 削除APIを呼び出し
  const response = await client.delete<DeleteAssistantTemplateResponse>(
    `/assistant_templates/${templateUuid}`
  )

  // 削除成功後、必要に応じてリストを更新（省略可能）
  if (shouldMutate) {
    await mutateDiscoverAssistantTemplates()
  }

  return DeleteAssistantTemplateResponse.parse(response.data)
}
