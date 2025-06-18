import { mutate } from 'swr'
import { z } from 'zod'

import { client } from '@/lib/api'

import { KEY as getSectionsKey } from './getAssistantTemplateSections'

const SectionResponse = z.object({
  uuid: z.string(),
  name: z.string(),
  displayOrder: z.number(),
})

export type SectionResponse = z.infer<typeof SectionResponse>

const UpdateSectionsOrderRequest = z.object({
  sectionUuids: z.array(z.string()),
})

export type UpdateSectionsOrderRequest = z.infer<
  typeof UpdateSectionsOrderRequest
>

const UpdateSectionsOrderResponse = z.object({
  sections: z.array(SectionResponse),
})

export type UpdateSectionsOrderResponse = z.infer<
  typeof UpdateSectionsOrderResponse
>

/**
 * アシスタントテンプレートセクションの並び順を更新する
 * @param request 更新リクエスト
 * @returns 更新レスポンス
 */
export const updateSectionsOrder = async (
  request: UpdateSectionsOrderRequest
) => {
  const response = await client.put<UpdateSectionsOrderResponse>(
    '/assistant_template_sections/order',
    request
  )

  // セクション一覧のキャッシュを更新
  await mutate(getSectionsKey())

  return UpdateSectionsOrderResponse.parse(response.data)
}
