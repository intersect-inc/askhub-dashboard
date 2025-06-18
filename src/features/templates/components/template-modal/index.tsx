import * as Button from '@/components/ui/button'
import * as Dropdown from '@/components/ui/dropdown'
import * as Modal from '@/components/ui/modal'
import {
  RiDeleteBinLine,
  RiEditLine,
  RiErrorWarningFill,
} from '@remixicon/react'
import { useState } from 'react'

export const EditTemplateModal = () => {
  const [open, setOpen] = useState(false)

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <Dropdown.Item
          onSelect={(e) => {
            e.preventDefault()
            setOpen(true)
          }}
        >
          <Dropdown.ItemIcon as={RiEditLine} />
          テンプレートを編集する
        </Dropdown.Item>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>テンプレートを編集する</Modal.Title>
        </Modal.Header>
        <Modal.Body>あああ</Modal.Body>
      </Modal.Content>
    </Modal.Root>
  )
}

export const DeleteTemplateModal = () => {
  const [open, setOpen] = useState(false)

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
          <Dropdown.ItemIcon as={RiDeleteBinLine} className="text-error-base" />
          テンプレートを削除する
        </Dropdown.Item>
      </Modal.Trigger>
      <Modal.Content className="max-w-[440px]">
        <Modal.Body className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-10 bg-error-lighter">
            <RiErrorWarningFill className="size-6 text-error-base" />
          </div>
          <div className="space-y-1">
            <div className="text-label-md text-text-strong-950">
              「誤字・脱字チェックアシスタント」を削除しますか？
            </div>
            <div className="text-paragraph-sm text-text-sub-600">
              この操作を実行すると、テンプレートが永久に削除されます。この操作は取り消すことができません。
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
            >
              キャンセル
            </Button.Root>
          </Modal.Close>
          <Button.Root size="small" className="w-full" variant="error">
            削除する
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  )
}
