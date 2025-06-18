'use client'

import { useState } from 'react'

import * as Button from '@/components/ui/button'
import * as Dropdown from '@/components/ui/dropdown'
import * as Modal from '@/components/ui/modal'
import { toast } from '@/components/ui/toast'
import * as AlertToast from '@/components/ui/toast-alert'
import { RiErrorWarningFill, RiProhibited2Line } from '@remixicon/react'
import { useExpireWorkspaceAdditionalCredit } from '../../api/expire-wrokspace-additional-usage'
import { useUpdateWorkspaceUsageLimit } from '../../api/updateWorkspaceUsageLimit'

type Props = {
  workspaceUuid: string
}

export const ExpireWorkspaceModal = (props: Props) => {
  const { workspaceUuid } = props
  const [open, setOpen] = useState(false)
  const [isExpiring, setIsExpiring] = useState(false)

  const { trigger: expireAdditionalCredit } =
    useExpireWorkspaceAdditionalCredit()
  const { trigger: updateUsageLimit } = useUpdateWorkspaceUsageLimit({
    onSuccess: () => {},
    onError: () => {},
  })

  const handleExpireWorkspace = async () => {
    setIsExpiring(true)
    try {
      // 1. 利用上限を0に設定
      await updateUsageLimit({
        workspace_uuid: workspaceUuid,
        usage_limit: 0,
      })

      // 2. 追加クレジットを期限切れにする
      await expireAdditionalCredit({
        workspace_uuid: workspaceUuid,
      })

      toast.custom(
        (t) => (
          <AlertToast.Root
            t={t}
            status="success"
            message="ワークスペースの利用を停止しました"
            variant="lighter"
          />
        ),
        {
          position: 'bottom-left',
        }
      )
      setOpen(false)
    } catch (error) {
      toast.custom(
        (t) => (
          <AlertToast.Root
            t={t}
            status="error"
            message="利用停止処理に失敗しました"
            variant="lighter"
          />
        ),
        {
          position: 'bottom-left',
        }
      )
    } finally {
      setIsExpiring(false)
    }
  }

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <Dropdown.Item
          onSelect={(e) => {
            e.preventDefault()
            setOpen(true)
          }}
          className="text-error-base"
        >
          <Dropdown.ItemIcon
            as={RiProhibited2Line}
            className="text-error-base"
          />
          利用を停止する
        </Dropdown.Item>
      </Modal.Trigger>
      <Modal.Content className="max-w-[440px]">
        <Modal.Body className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-10 bg-error-lighter">
            <RiErrorWarningFill className="size-6 text-error-base" />
          </div>
          <div className="space-y-1">
            <div className="text-label-md text-text-strong-950">
              利用を停止する
            </div>
            <div className="text-paragraph-sm text-text-sub-600">
              この操作を実行すると、ワークスペースメンバー全員の利用上限が0になり、追加クレジットも全て削除されます。
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button.Root
              variant="neutral"
              mode="stroke"
              size="small"
              className="w-full"
              disabled={isExpiring}
            >
              キャンセル
            </Button.Root>
          </Modal.Close>
          <Button.Root
            size="small"
            className="w-full"
            variant="error"
            onClick={handleExpireWorkspace}
            disabled={isExpiring}
          >
            {isExpiring ? '停止中...' : '利用を停止する'}
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  )
}
