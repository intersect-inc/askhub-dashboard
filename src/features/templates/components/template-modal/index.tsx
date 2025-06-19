'use client'

import * as Button from '@/components/ui/button'
import * as Dropdown from '@/components/ui/dropdown'
import * as Input from '@/components/ui/input'
import * as Label from '@/components/ui/label'
import * as Modal from '@/components/ui/modal'
import { toast } from '@/components/ui/toast'
import * as AlertToast from '@/components/ui/toast-alert'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  RiDeleteBinLine,
  RiEditLine,
  RiErrorWarningFill,
} from '@remixicon/react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { deleteAssistantTemplate } from '../../api/delete-assistant-template'
import { AssistantTemplate } from '../../api/getDiscoverAssistantTemplates'
import { useTemplateAssistantSections } from '../../api/getTemplateAssistantSections'
import {
  updateAssistantTemplate,
  UpdateAssistantTemplateRequest,
} from '../../api/updateAssistantTemplate'
import { SectionSelectDropdown } from '../section-select-dropdowm'

type EditTemplateModalProps = {
  template: AssistantTemplate
}

export const EditTemplateModal = ({ template }: EditTemplateModalProps) => {
  const [open, setOpen] = useState(false)
  const [selectedSection, setSelectedSection] = useState(
    template.sectionName ?? ''
  )
  const { data: sections } = useTemplateAssistantSections()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateAssistantTemplateRequest>({
    defaultValues: {
      name: template.name,
      section_uuid: template.sectionUuid,
    },
    resolver: zodResolver(UpdateAssistantTemplateRequest),
  })

  const onSubmit = async (data: UpdateAssistantTemplateRequest) => {
    try {
      await updateAssistantTemplate(template.uuid, data)
      toast.custom(
        (t) => (
          <AlertToast.Root
            t={t}
            status="success"
            message="テンプレートを更新しました"
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
            message="テンプレートの更新に失敗しました"
            variant="lighter"
          />
        ),
        {
          position: 'bottom-left',
        }
      )
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
        >
          <Dropdown.ItemIcon as={RiEditLine} />
          テンプレートを編集する
        </Dropdown.Item>
      </Modal.Trigger>
      <Modal.Content>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header>
            <Modal.Title>テンプレートを編集する</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="flex flex-col gap-1.5">
              <Label.Root>
                テンプレート名 <Label.Asterisk />
              </Label.Root>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    placeholder="テンプレート名"
                    {...register('name')}
                    hasError={!!errors.name}
                  />
                </Input.Wrapper>
              </Input.Root>
              {errors.name && (
                <div className="text-paragraph-xs text-error-base">
                  {errors.name.message}
                </div>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-1.5">
              <Label.Root>
                セクション
                <Label.Asterisk />
              </Label.Root>
              <SectionSelectDropdown
                options={
                  sections?.sections.map((section) => ({
                    id: section.uuid,
                    label: section.name,
                    value: section.uuid,
                  })) ?? []
                }
                defaultValue={selectedSection}
                onValueChange={(value) => {
                  const selectedSectionName =
                    sections?.sections.find((section) => section.uuid === value)
                      ?.name ?? ''
                  setSelectedSection(selectedSectionName)
                  setValue('section_uuid', value)
                }}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button.Root
              type="button"
              variant="neutral"
              mode="stroke"
              size="small"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              キャンセル
            </Button.Root>
            <Button.Root type="submit" size="small" className="w-full">
              変更する
            </Button.Root>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  )
}

export const DeleteTemplateModal = ({ template }: EditTemplateModalProps) => {
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    try {
      await deleteAssistantTemplate(template.uuid)
      toast.custom(
        (t) => (
          <AlertToast.Root
            t={t}
            status="success"
            message="テンプレートを削除しました"
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
            message="テンプレートの削除に失敗しました"
            variant="lighter"
          />
        ),
        {
          position: 'bottom-left',
        }
      )
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
              「{template.name}」を削除しますか？
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
          <Button.Root
            size="small"
            className="w-full"
            variant="error"
            onClick={handleDelete}
          >
            削除する
          </Button.Root>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  )
}
