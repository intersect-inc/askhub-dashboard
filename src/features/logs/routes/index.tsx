'use client'

import * as Button from '@/components/ui/button'
import { RiArrowLeftLine, RiArrowRightLine } from '@remixicon/react'
import { useState } from 'react'
import { useMessages } from '../api/getMessages'
import { LogTable } from '../components/logTable'

export const LogsRoute = () => {
  const [page, setPage] = useState(1)
  const { data } = useMessages(page, undefined, undefined)
  return (
    <div className="flex h-full flex-col py-6" style={{ gap: '1rem' }}>
      <div className="min-h-0 flex-1">
        <LogTable messages={data?.messages ?? []} />
      </div>
      <div className="flex w-full justify-center gap-2">
        <Button.Root onClick={() => setPage(page - 1)}>
          <Button.Icon>
            <RiArrowLeftLine />
          </Button.Icon>
        </Button.Root>
        <Button.Root onClick={() => setPage(page + 1)}>
          <Button.Icon>
            <RiArrowRightLine />
          </Button.Icon>
        </Button.Root>
      </div>
    </div>
  )
}
