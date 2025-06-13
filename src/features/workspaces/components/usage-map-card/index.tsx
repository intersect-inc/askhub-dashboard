import { format } from 'date-fns'
import { useState } from 'react'
import { useGetUsageMap } from '../../api/getUsageMap'
import { DatepickerPopover } from '../date-picker'
import { UsageMapChart } from './usage-map-chart'

type Props = {
  workspaceUuid: string
}

export const UsageMapCard = (props: Props) => {
  const { workspaceUuid } = props
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  const { data } = useGetUsageMap({
    workspaceUuid,
    yearMonth: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined,
  })

  if (!data) {
    return null
  }

  return (
    <div className="flex h-full flex-col rounded-10 border border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <p className="text-label-lg">使用状況</p>
        <DatepickerPopover value={selectedDate} onChange={setSelectedDate} />
      </div>
      <div className="mt-4">
        <UsageMapChart data={data} />
      </div>
    </div>
  )
}
