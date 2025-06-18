'use client'

import * as Button from '@/components/ui/button'
import * as Input from '@/components/ui/input'
import * as Label from '@/components/ui/label'
import * as Modal from '@/components/ui/modal'
import { toast } from '@/components/ui/toast'
import * as AlertToast from '@/components/ui/toast-alert'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { bulkCreateAdditionalCredits } from '../../api/bulkAdditionalCredits'

// ユーザー型定義
type Member = {
  workspaceMemberUuid: string
  displayName: string
  email: string
  workspaceUuid: string
}

// フォームスキーマ
const addCreditSchema = z.object({
  amount: z
    .number({ invalid_type_error: '数値を入力してください' })
    .min(1, '1以上の値を入力してください')
    .max(100000, '100,000以下の値を入力してください')
    .optional(), // 複数メンバーの場合は使わない
  memberCredits: z
    .array(
      z.object({
        workspaceMemberUuid: z.string(),
        amount: z
          .number({ invalid_type_error: '数値を入力してください' })
          .min(1, '1以上の値を入力してください')
          .max(100000, '100,000以下の値を入力してください'),
      })
    )
    .optional(), // 単一メンバーの場合は使わない
})

type AddCreditFormData = z.infer<typeof addCreditSchema>

type AddCreditModalProps = {
  selectedMembers: Member[]
  children: React.ReactNode
}

export const AddCreditModal = ({
  selectedMembers,
  children,
}: AddCreditModalProps) => {
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isSingleMember = selectedMembers.length === 1

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddCreditFormData>({
    resolver: zodResolver(addCreditSchema),
    defaultValues: {
      amount: undefined,
      memberCredits: isSingleMember
        ? undefined
        : selectedMembers.map((member) => ({
            workspaceMemberUuid: member.workspaceMemberUuid,
            amount: 0,
          })),
    },
  })

  const handleAddCredit = async (data: AddCreditFormData) => {
    try {
      setIsSubmitting(true)

      // API呼び出し (既存のemail-based APIを使用)
      let emailCreditList: [string, number][]

      if (isSingleMember) {
        // 単一メンバーの場合
        emailCreditList = [[selectedMembers[0].email, data.amount!]]
      } else {
        // 複数メンバーの場合、各メンバーに個別の金額
        emailCreditList = selectedMembers.map((member) => {
          const memberCredit = data.memberCredits?.find(
            (mc) => mc.workspaceMemberUuid === member.workspaceMemberUuid
          )
          return [member.email, memberCredit?.amount || 0]
        })
      }

      const response = await bulkCreateAdditionalCredits(emailCreditList)

      // 成功・失敗の処理
      if (response.failed_count > 0) {
        // 一部失敗した場合
        const failedMembers = response.results
          .filter((result) => result.status === 'failed')
          .map((result) => result.error)
          .join(', ')

        toast.custom(
          (t) => (
            <AlertToast.Root
              t={t}
              status="warning"
              message={`${response.success_count}件成功、${response.failed_count}件失敗しました。失敗理由: ${failedMembers}`}
              variant="lighter"
            />
          ),
          {
            position: 'bottom-left',
          }
        )
      }

      // 完全成功の場合のみ成功メッセージを表示
      if (response.success_count > 0 && response.failed_count === 0) {
        const successMessage = isSingleMember
          ? `${selectedMembers[0].displayName}に${data.amount}クレジットを追加しました`
          : `${selectedMembers.length}名のメンバーにクレジットを追加しました`

        toast.custom(
          (t) => (
            <AlertToast.Root
              t={t}
              status="success"
              message={successMessage}
              variant="lighter"
            />
          ),
          {
            position: 'bottom-left',
          }
        )
      }

      // 成功後の処理
      handleModalClose()
    } catch (error) {
      toast.custom(
        (t) => (
          <AlertToast.Root
            t={t}
            status="error"
            message="クレジットの追加に失敗しました"
            variant="lighter"
          />
        ),
        {
          position: 'bottom-left',
        }
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleModalClose = () => {
    setOpen(false)
    reset()
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      reset()
    }
  }

  // 複数メンバーの場合の一括金額設定
  const setBulkAmount = (amount: number) => {
    if (!isSingleMember) {
      const updatedCredits = selectedMembers.map((member) => ({
        workspaceMemberUuid: member.workspaceMemberUuid,
        amount: amount,
      }))
      setValue('memberCredits', updatedCredits)
    }
  }

  return (
    <Modal.Root open={open} onOpenChange={handleOpenChange}>
      <Modal.Trigger asChild>
        <div onClick={() => setOpen(true)}>{children}</div>
      </Modal.Trigger>

      <Modal.Content className="max-w-[500px]">
        <Modal.Header>
          <Modal.Title className="flex items-center gap-2">
            {selectedMembers.length === 1
              ? `${selectedMembers[0].displayName}にクレジット追加`
              : 'クレジット追加'}
          </Modal.Title>
        </Modal.Header>

        <form onSubmit={handleSubmit(handleAddCredit)}>
          <Modal.Body className="space-y-6">
            {isSingleMember ? (
              // 単一メンバーの場合
              <>
                <div className="space-y-2">
                  <p className="text-paragraph-sm text-text-sub-600">
                    以下のメンバーにクレジットを追加します：
                  </p>
                  <div className="rounded-lg border border-stroke-soft-200 p-3">
                    <div className="flex items-center justify-between text-paragraph-sm">
                      <span className="text-text-strong-950">
                        {selectedMembers[0].displayName}
                      </span>
                      <span className="text-text-sub-600">
                        {selectedMembers[0].email}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label.Root>
                    追加するクレジット数 <Label.Asterisk />
                  </Label.Root>
                  <Input.Root>
                    <Input.Wrapper>
                      <Input.Input
                        type="number"
                        placeholder="例: 1000"
                        hasError={!!errors.amount}
                        {...register('amount', { valueAsNumber: true })}
                      />
                    </Input.Wrapper>
                  </Input.Root>
                  {errors.amount && (
                    <p className="text-paragraph-xs text-error-base">
                      {errors.amount.message}
                    </p>
                  )}
                </div>
              </>
            ) : (
              // 複数メンバーの場合
              <>
                <div className="space-y-2">
                  <p className="text-paragraph-sm text-text-sub-600">
                    各メンバーに追加するクレジット数を設定してください
                  </p>

                  {/* 一括設定機能 */}
                  <div className="flex items-center gap-2 rounded-lg">
                    <span className="text-paragraph-sm text-text-strong-950">
                      一括設定:
                    </span>
                    <Input.Root className="w-32">
                      <Input.Wrapper>
                        <Input.Input
                          type="number"
                          placeholder="1000"
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 0
                            setBulkAmount(value)
                          }}
                        />
                      </Input.Wrapper>
                    </Input.Root>
                  </div>

                  {/* 個別設定 */}
                  <div className="max-h-64 space-y-3 overflow-y-auto rounded-lg border border-stroke-soft-200 p-3 custom-scroll-bar">
                    {selectedMembers.map((member, index) => (
                      <div
                        key={member.workspaceMemberUuid}
                        className="flex items-center gap-3"
                      >
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-paragraph-xs text-text-sub-600">
                              {member.email}
                            </span>
                          </div>
                        </div>
                        <div className="w-24">
                          <Input.Root>
                            <Input.Wrapper>
                              <Input.Input
                                type="number"
                                placeholder="0"
                                hasError={
                                  !!errors.memberCredits?.[index]?.amount
                                }
                                {...register(`memberCredits.${index}.amount`, {
                                  valueAsNumber: true,
                                })}
                              />
                            </Input.Wrapper>
                          </Input.Root>
                          {errors.memberCredits?.[index]?.amount && (
                            <p className="mt-1 text-paragraph-xs text-error-base">
                              {errors.memberCredits[index]?.amount?.message}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </Modal.Body>

          <Modal.Footer className="flex gap-2">
            <Modal.Close asChild>
              <Button.Root
                variant="neutral"
                mode="stroke"
                size="small"
                className="flex-1"
                type="button"
              >
                キャンセル
              </Button.Root>
            </Modal.Close>
            <Button.Root
              variant="primary"
              mode="filled"
              size="small"
              className="flex-1"
              type="submit"
              isLoading={isSubmitting}
              disabled={selectedMembers.length === 0}
            >
              クレジットを追加
            </Button.Root>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  )
}
