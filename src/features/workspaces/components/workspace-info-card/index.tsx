import * as Divider from '@/components/ui/divider'
import { format } from 'date-fns'
import { useState } from 'react'
import { useGetUsageMap } from '../../api/getUsageMap'
import { UpdateUsageLimitModal } from '../update-usage-limit-modal'

type Props = {
  workspaceUuid: string
}

export const WorkspaceInfoCard = (props: Props) => {
  const { workspaceUuid } = props
  // FIXME: 日付選択機能を追加する
  const [selectedDate] = useState<Date | undefined>(new Date())

  const { data } = useGetUsageMap({
    workspaceUuid,
    yearMonth: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined,
  })

  if (!data) {
    return null
  }

  return (
    <div className="flex h-full flex-col gap-5 rounded-10 border border-stroke-soft-200 p-4">
      <div className="flex h-10 items-center justify-between">
        <p className="text-label-md text-text-strong-950">基本情報</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-paragraph-sm text-text-sub-600">
            ワークスペース名
          </p>
          <p className="text-paragraph-sm text-text-strong-950">
            {data.workspaces[0].workspaceName}
          </p>
        </div>
        <Divider.Root />
        <div className="flex flex-col gap-2">
          <p className="text-paragraph-sm text-text-sub-600">
            デフォルトの利用上限
          </p>
          <div className="flex w-full items-center justify-between gap-2">
            <p className="text-paragraph-sm text-text-strong-950">
              今は取得できない
            </p>
            <UpdateUsageLimitModal workspaceUuid={workspaceUuid} />
          </div>
        </div>
        <Divider.Root />
        <div className="flex flex-col gap-2">
          <p className="text-paragraph-sm text-text-sub-600">利用開始日</p>
          <p className="text-paragraph-sm text-text-strong-950">
            今は取得できない
          </p>
        </div>
      </div>
    </div>
  )
}
