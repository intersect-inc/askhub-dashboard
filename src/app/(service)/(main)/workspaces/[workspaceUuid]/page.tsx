'use client'

import * as Button from '@/components/ui/button'
import { toast } from '@/components/ui/toast'
import * as AlertToast from '@/components/ui/toast-alert'
import { useParams } from 'next/navigation'

export default function WorkspacePage() {
  const { workspaceUuid } = useParams()

  return (
    <div>
      {workspaceUuid}
      <Button.Root
        variant="neutral"
        mode="stroke"
        onClick={() => {
          toast.custom(
            (t) => (
              <AlertToast.Root
                t={t}
                status="success"
                message="ワークスペースを作成しました"
                variant="lighter"
              />
            ),
            {
              position: 'bottom-right',
            }
          )
        }}
      >
        bottom-right
      </Button.Root>
    </div>
  )
}
