'use client'

import { useState } from 'react'

import * as Button from '@/components/ui/button'
import * as Dropdown from '@/components/ui/dropdown'
import * as Input from '@/components/ui/input'
import * as Label from '@/components/ui/label'
import * as Modal from '@/components/ui/modal'
import { toast } from '@/components/ui/toast'
import * as AlertToast from '@/components/ui/toast-alert'
import { zodResolver } from '@hookform/resolvers/zod'
import { RiDownloadLine } from '@remixicon/react'
import { useForm } from 'react-hook-form'
import {
  updateWorkspaceUsageLimitSchema,
  useUpdateWorkspaceUsageLimit,
} from '../../api/updateWorkspaceUsageLimit'

type Props = {
  workspaceUuid: string
}

export const DownloadModal = (props: Props) => {
  const { workspaceUuid } = props
  const [open, setOpen] = useState(false)
  const { trigger } = useUpdateWorkspaceUsageLimit({
    onSuccess: () => {
      toast.custom(
        (t) => (
          <AlertToast.Root
            t={t}
            status="success"
            message="利用料上限を変更しました"
            variant="lighter"
          />
        ),
        {
          position: 'bottom-left',
        }
      )
      setOpen(false)
    },
    onError: () => {
      toast.custom(
        (t) => (
          <AlertToast.Root
            t={t}
            status="error"
            message="利用料上限の変更に失敗しました"
            variant="lighter"
          />
        ),
        {
          position: 'bottom-left',
        }
      )
    },
  })

  type FormValues = {
    usage_limit: number
  }

  const onSubmit = async (data: FormValues) => {
    try {
      await trigger({
        workspace_uuid: workspaceUuid,
        usage_limit: data.usage_limit,
      })
    } catch (error) {
      //ignore
    }
  }

  const formMethods = useForm<FormValues>({
    resolver: zodResolver(
      updateWorkspaceUsageLimitSchema.omit({ workspace_uuid: true })
    ),
  })
  const {
    register,
    handleSubmit,
    formState: {},
  } = formMethods

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <Dropdown.Item
          onSelect={(e) => {
            e.preventDefault()
            setOpen(true)
          }}
        >
          <Dropdown.ItemIcon as={RiDownloadLine} />
          ダウンロード
        </Dropdown.Item>
      </Modal.Trigger>
      <Modal.Content className="max-w-[440px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header>
            <Modal.Title>利用上限の変更</Modal.Title>
          </Modal.Header>
          <Modal.Body className="flex flex-col gap-2">
            <Label.Root htmlFor="workspace-name">
              新しい利用料上限
              <Label.Asterisk />
            </Label.Root>
            <Input.Root>
              <Input.Wrapper>
                <Input.Input
                  type="number"
                  placeholder="新しいAI利用料上限"
                  {...register('usage_limit', {
                    valueAsNumber: true,
                  })}
                />
              </Input.Wrapper>
            </Input.Root>
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
            <Button.Root type="submit" size="small" className="w-full">
              変更する
            </Button.Root>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  )
}
