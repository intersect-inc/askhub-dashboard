'use client'

import { RiAddLine, RiInformationFill } from '@remixicon/react'

import { TagsInput } from '@/components/elements/tags-input'
import * as Button from '@/components/ui/button'
import * as Hint from '@/components/ui/hint'
import * as Input from '@/components/ui/input'
import * as Label from '@/components/ui/label'
import * as Modal from '@/components/ui/modal'
import * as Tag from '@/components/ui/tag'
import { toast } from '@/components/ui/toast'
import * as AlertToast from '@/components/ui/toast-alert'
import {
  CreateWorkspaceSchema,
  useCreateWorkspace,
} from '@/features/workspaces/api/createWorkspace'
import { KeyboardEvent, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export const CreateWorkspaceModal = () => {
  const [open, setOpen] = useState(false)
  const [emails, setEmails] = useState<string[]>([])
  const [inputValue, setInputValue] = useState('')
  const [inputError, setInputError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>(
    '有効なメールアドレスを入力してください'
  )

  const { trigger, isMutating } = useCreateWorkspace({
    onSuccess: () => {
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
            message="ワークスペースの作成に失敗しました"
            variant="lighter"
          />
        ),
        {
          position: 'bottom-left',
        }
      )
    },
  })

  const { register, handleSubmit } = useForm<CreateWorkspaceSchema>({
    resolver: zodResolver(CreateWorkspaceSchema),
  })

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      const trimmedEmail = inputValue.trim()

      if (isValidEmail(trimmedEmail)) {
        setEmails([...emails, trimmedEmail])
        setInputValue('')
        setInputError(false)
      } else {
        setInputError(true)
        setErrorMessage('有効なメールアドレスを入力してください')
      }
    }
  }

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove))
  }

  const handleBlur = () => {
    checkInputError()
  }

  const checkInputError = () => {
    if (inputValue.trim() !== '') {
      if (!isValidEmail(inputValue.trim())) {
        setInputError(true)
        setErrorMessage('有効なメールアドレスを入力してください')
      } else {
        setInputError(false)
      }
    } else {
      setInputError(false)
    }
  }

  const onSubmit = async (data: CreateWorkspaceSchema) => {
    await trigger({
      values: {
        ...data,
        emails: emails.length > 0 ? emails : undefined,
      },
    })
    setOpen(false)
  }

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger asChild>
        <Button.Root
          variant="primary"
          mode="filled"
          onClick={() => setOpen(true)}
        >
          <Button.Icon>
            <RiAddLine className="text-white" />
          </Button.Icon>
          新規ワークスペース作成
        </Button.Root>
      </Modal.Trigger>
      <Modal.Content className="max-w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Header>
            <Modal.Title>新規ワークスペース作成</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0">
            <div className="flex flex-col gap-4 p-5">
              <div className="flex flex-col gap-1.5">
                <Label.Root htmlFor="workspace-name">
                  ワークスペース名
                  <Label.Asterisk />
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      type="text"
                      placeholder="ワークスペース名"
                      {...register('name')}
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label.Root htmlFor="workspace-name">
                  AI利用料上限
                  <Label.Asterisk />
                </Label.Root>
                <Input.Root>
                  <Input.Wrapper>
                    <Input.Input
                      type="number"
                      placeholder="AI利用料上限"
                      {...register('usageLimit', { valueAsNumber: true })}
                    />
                  </Input.Wrapper>
                </Input.Root>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label.Root htmlFor="workspace-name">
                  メールアドレス
                  <Label.Asterisk />
                </Label.Root>
                <TagsInput
                  placeholder="メールアドレスを入力してください"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value)
                    setInputError(false)
                  }}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                >
                  {!!emails.length && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {emails.map((email) => (
                        <Tag.Root key={email}>
                          {email}
                          <Tag.DismissButton
                            onClick={() => removeEmail(email)}
                          />
                        </Tag.Root>
                      ))}
                    </div>
                  )}
                </TagsInput>
                <Hint.Root>
                  <Hint.Icon as={RiInformationFill} />
                  {inputError
                    ? errorMessage
                    : 'エンターで招待するメンバーを複数追加することができます。'}
                </Hint.Root>
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
              type="submit"
              isLoading={isMutating}
            >
              作成する
            </Button.Root>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  )
}
