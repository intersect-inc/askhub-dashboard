'use client'

import { LogTable } from '../components/logTable'

export const LogsRoute = () => {
  return (
    <div className="flex h-full flex-col gap-6 py-6">
      <div className="min-h-0 flex-1">
        <LogTable />
      </div>
    </div>
  )
}
