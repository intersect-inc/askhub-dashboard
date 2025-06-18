'use client'

import { RiEqualizer2Line } from '@remixicon/react'
import * as React from 'react'

import * as Button from '@/components/ui/button'
import * as Modal from '@/components/ui/modal'

export const SectionSettingModal = () => {
  const [open, setOpen] = React.useState(false)

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <Button.Root
          variant="neutral"
          mode="ghost"
          size="xxsmall"
          className="absolute right-0 top-1/2 -translate-y-1/2"
          onClick={() => setOpen(true)}
        >
          <Button.Icon as={RiEqualizer2Line} />
        </Button.Root>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>セクション設定</Modal.Title>
          <Modal.Description>セクションの設定を変更できます</Modal.Description>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4">
            {/* ここにセクション設定のフォームなどを追加 */}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close asChild>
            <Button.Root
              variant="neutral"
              mode="stroke"
              size="small"
              className="w-full"
            >
              キャンセル
            </Button.Root>
          </Modal.Close>
          <Button.Root size="small" className="w-full">
            保存
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  )
}
