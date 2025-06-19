import * as Divider from '@/components/ui/divider'
import { format } from 'date-fns'
import React, { useState } from 'react'
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
    <div className="flex h-full flex-col gap-8 rounded-10 border border-stroke-soft-200 p-4">
      <div className="flex items-center justify-between">
        <p className="text-label-md text-text-strong-950">使用状況</p>
        <DatepickerPopover value={selectedDate} onChange={setSelectedDate} />
      </div>
      <div className="flex items-end justify-between gap-4">
        <UsageMapChart data={data} />
        <div className="w-64 shrink-0">
          {data.workspaces.map((item) => (
            <div key={item.workspaceUuid} className="flex w-full">
              <div className="flex w-full flex-col gap-2">
                {item.usageCounts.map((usage, index) => (
                  <React.Fragment key={usage.rangeName}>
                    <div
                      key={usage.rangeName}
                      className="flex justify-between gap-2"
                    >
                      <p className="text-paragraph-sm text-text-sub-600">
                        {usage.rangeName}
                      </p>
                      <p className="text-paragraph-sm text-text-sub-600">
                        {usage.memberCount}名
                      </p>
                    </div>
                    {index !== item.usageCounts.length - 1 && <Divider.Root />}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
