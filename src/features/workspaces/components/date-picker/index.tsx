'use client'

import { format } from 'date-fns'
import * as React from 'react'

import * as Button from '@/components/ui/button'
import * as DatepickerPrimivites from '@/components/ui/datepicker'
import * as Popover from '@/components/ui/popover'

type SingleDatepickerProps = {
  defaultValue?: Date
  value?: Date
  onChange?: (date: Date | undefined) => void
}

function Datepicker({ value, defaultValue, onChange }: SingleDatepickerProps) {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState<Date | undefined>(
    value ?? defaultValue ?? undefined
  )

  const handleChange = (value: Date | undefined) => {
    setDate(value)
    onChange?.(value)
    setOpen(false)
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button.Root variant="neutral" mode="stroke">
          {date ? format(date, 'yyyy-MM-dd') : '日付を選択'}
        </Button.Root>
      </Popover.Trigger>
      <Popover.Content className="p-0" showArrow={false}>
        <DatepickerPrimivites.Calendar
          mode="single"
          selected={date}
          onSelect={handleChange}
        />
      </Popover.Content>
    </Popover.Root>
  )
}

type DatepickerPopoverProps = {
  value?: Date
  onChange?: (date: Date | undefined) => void
}

export function DatepickerPopover({ value, onChange }: DatepickerPopoverProps) {
  return <Datepicker value={value} onChange={onChange} />
}
