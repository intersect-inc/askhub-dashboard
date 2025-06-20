'use client'

import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import * as React from 'react'
import { DateRange } from 'react-day-picker'

import * as Button from '@/components/ui/button'
import * as DatepickerPrimivites from '@/components/ui/datepicker'
import * as Popover from '@/components/ui/popover'

type SingleDatepickerProps = {
  defaultValue?: DateRange
  value?: DateRange
  onChange?: (range: DateRange | undefined) => void
}

export function Datepicker({
  value,
  defaultValue,
  onChange,
}: SingleDatepickerProps) {
  const [open, setOpen] = React.useState(false)
  const [range, setRange] = React.useState<DateRange | undefined>(
    value ?? defaultValue ?? undefined
  )

  const handleChange = (value: DateRange | undefined) => {
    setRange(value)
    onChange?.(value)
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button.Root variant="neutral" mode="stroke">
          {range?.from ? (
            <>
              {format(range.from, 'yyyy/MM/dd')}
              {range.to && <> - {format(range.to, 'yyyy/MM/dd')}</>}
            </>
          ) : (
            <span>期間を選択</span>
          )}
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content className="p-0" showArrow={false}>
        <DatepickerPrimivites.Calendar
          mode="range"
          selected={range}
          onSelect={handleChange}
          locale={ja}
        />
      </Popover.Content>
    </Popover.Root>
  )
}
