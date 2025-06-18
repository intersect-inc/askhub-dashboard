'use client'

import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { RiAddLine, RiArrowLeftLine } from '@remixicon/react'
import * as React from 'react'

import * as Avatar from '@/components/ui/avatar'
import * as Button from '@/components/ui/button'
import * as Checkbox from '@/components/ui/checkbox'
import * as Input from '@/components/ui/input'
import * as Modal from '@/components/ui/modal'
import { toast } from '@/components/ui/toast'
import * as AlertToast from '@/components/ui/toast-alert'
import { cn } from '@/utils/cn'
import { formatDateTime } from '@/utils/time'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, useWatch } from 'react-hook-form'
import { mutate } from 'swr'
import { z } from 'zod'
import { createAssistantTemplatesFromAssistants } from '../../api/createAssistantTemplatesFromAssistants'
import { useDiscoverAssistants } from '../../api/getDiscoverAssistants'
import { useTemplateAssistantSections } from '../../api/getTemplateAssistantSections'
import {
  useDiscoverAssistantsKey,
  useDiscoverAssistantsStore,
} from '../../hooks/useDiscoverAssistants'
import { SectionSelectDropdown } from '../section-select-dropdowm'

// フォームのスキーマ
const formSchema = z.object({
  assistantTemplates: z
    .array(
      z.object({
        assistantUuid: z.string().min(1, 'アシスタントUUIDを入力してください'),
        templateSectionUuid: z.string().min(1, 'セクションを選択してください'),
      })
    )
    .min(1, '少なくとも1つのペアを追加してください'),
})

type FormSchema = z.infer<typeof formSchema>

// ステップの定義
type Step = 'SELECT_ASSISTANTS' | 'SELECT_SECTIONS'

export const AddAssistantTemplateModal = () => {
  const [open, setOpen] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [selectedAssistants, setSelectedAssistants] = React.useState<string[]>(
    []
  )
  const [currentStep, setCurrentStep] =
    React.useState<Step>('SELECT_ASSISTANTS')

  // useDiscoverAssistantsStoreを利用
  const { query, setQuery, isDeferred } = useDiscoverAssistantsStore()

  // APIリクエストパラメータを取得
  const requestParams = useDiscoverAssistantsKey()

  // requestParamsを使用してAPIを呼び出す
  const { data: assistantsData, isLoading: isAssistantsLoading } =
    useDiscoverAssistants(requestParams)

  const { data: sections } = useTemplateAssistantSections()

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      assistantTemplates: [],
    },
    mode: 'onChange',
  })

  const assistantTemplates = useWatch({
    control,
    name: 'assistantTemplates',
  })

  const handleCreateTemplates = async (data: FormSchema) => {
    try {
      // バリデーションチェック
      // セクションが選択されていない項目がある場合はエラーメッセージを表示
      const invalidItems = data.assistantTemplates.filter(
        (item) => !item.templateSectionUuid
      )

      if (invalidItems.length > 0) {
        toast.custom(
          (t) => (
            <AlertToast.Root
              t={t}
              status="error"
              message="すべてのアシスタントにセクションを選択してください"
              variant="lighter"
            />
          ),
          {
            position: 'bottom-left',
          }
        )
        return
      }

      setIsSubmitting(true)

      // 有効なテンプレートのみ送信（空のtemplateSectionUuidを持つ項目を除外）
      const validTemplates = data.assistantTemplates.filter(
        (template) =>
          template.templateSectionUuid &&
          template.templateSectionUuid.trim() !== ''
      )

      if (validTemplates.length === 0) {
        toast.custom(
          (t) => (
            <AlertToast.Root
              t={t}
              status="error"
              message="有効なテンプレートがありません"
              variant="lighter"
            />
          ),
          {
            position: 'bottom-left',
          }
        )
        setIsSubmitting(false)
        return
      }

      await createAssistantTemplatesFromAssistants({
        assistant_templates: validTemplates.map((template) => ({
          assistant_uuid: template.assistantUuid,
          template_section_uuid: template.templateSectionUuid,
        })),
      })

      toast.custom(
        (t) => (
          <AlertToast.Root
            t={t}
            status="success"
            message="テンプレートを作成しました"
            variant="lighter"
          />
        ),
        {
          position: 'bottom-left',
        }
      )

      // テンプレート一覧をリフレッシュするために正しい型でKEYを渡してmutate
      await mutate(['/assistant_templates/discover'])

      // 成功後にstateをリセットしてモーダルを閉じる
      resetModalState()
      setOpen(false)
    } catch (error) {
      toast.custom(
        (t) => (
          <AlertToast.Root
            t={t}
            status="error"
            message="テンプレートの作成に失敗しました"
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

  const toggleAssistantSelection = (uuid: string) => {
    setSelectedAssistants((prev) =>
      prev.includes(uuid) ? prev.filter((id) => id !== uuid) : [...prev, uuid]
    )
  }

  const handleSelectSection = (sectionUuid: string, assistantUuid: string) => {
    const assistantIndex = assistantTemplates?.findIndex(
      (template) => template.assistantUuid === assistantUuid
    )

    if (assistantIndex !== undefined && assistantIndex !== -1) {
      setValue(
        `assistantTemplates.${assistantIndex}.templateSectionUuid`,
        sectionUuid
      )
    }
  }

  // 全選択/全解除の処理
  const handleSelectAll = (checked: CheckboxPrimitive.CheckedState) => {
    if (checked === true) {
      setSelectedAssistants(assistantsData?.assistants.map((a) => a.uuid) || [])
    } else {
      setSelectedAssistants([])
    }
  }

  // 次のステップに進む
  const goToNextStep = () => {
    if (selectedAssistants.length === 0) {
      toast.custom(
        (t) => (
          <AlertToast.Root
            t={t}
            status="error"
            message="少なくとも1つのアシスタントを選択してください"
            variant="lighter"
          />
        ),
        {
          position: 'bottom-left',
        }
      )
      return
    }

    // 選択された各アシスタントのテンプレートを初期化
    const initialTemplates = selectedAssistants.map((assistantUuid) => {
      // 既存のセクション選択を保持
      const existing = assistantTemplates?.find(
        (template) => template.assistantUuid === assistantUuid
      )

      return {
        assistantUuid,
        // 空文字ではなく未定義として初期化（バリデーションでエラーが表示されるように）
        templateSectionUuid: existing?.templateSectionUuid || '',
      }
    })

    setValue('assistantTemplates', initialTemplates)
    setCurrentStep('SELECT_SECTIONS')
  }

  // 前のステップに戻る
  const goToPreviousStep = () => {
    setCurrentStep('SELECT_ASSISTANTS')
  }

  // モーダルの状態をリセットする関数
  const resetModalState = () => {
    setSelectedAssistants([])
    setCurrentStep('SELECT_ASSISTANTS')
    setQuery('')
    reset()
  }

  // モーダルの開閉状態が変わった時の処理
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      // モーダルが閉じられた時にstateをリセット
      resetModalState()
    }
  }

  return (
    <Modal.Root open={open} onOpenChange={handleOpenChange}>
      <Modal.Trigger asChild>
        <Button.Root onClick={() => setOpen(true)}>
          <Button.Icon as={RiAddLine} />
          新規テンプレート作成
        </Button.Root>
      </Modal.Trigger>
      <Modal.Content className="flex h-[80vh] max-w-[80vw] flex-col overflow-hidden">
        <Modal.Header title="アシスタントテンプレート作成" />
        <Modal.Body className="flex-1 overflow-y-auto custom-scroll-bar">
          <div
            className={`flex flex-col gap-4 ${
              currentStep === 'SELECT_SECTIONS' ? 'pb-10' : ''
            }`}
          >
            <form
              id="create-templates-form"
              onSubmit={handleSubmit(handleCreateTemplates)}
            >
              <div className="flex flex-col gap-4">
                {currentStep === 'SELECT_ASSISTANTS' ? (
                  // Step 1: アシスタント選択画面
                  <>
                    <p className="text-label-sm text-text-strong-950">
                      ※インターセクトワークスペースに公開されているアシスタントしか表示されません。
                    </p>
                    <div className="mb-4 flex max-w-[400px] items-center gap-3">
                      <Input.Root className="w-full">
                        <Input.Wrapper>
                          <Input.Input
                            placeholder="アシスタントを検索"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                          />
                        </Input.Wrapper>
                      </Input.Root>
                      {isDeferred && (
                        <div className="text-paragraph-xs text-text-soft-400">
                          検索中...
                        </div>
                      )}
                    </div>

                    {/* アシスタント選択テーブル */}
                    <div className="rounded-lg border border-stroke-soft-200">
                      <table className="w-full overflow-hidden rounded-md">
                        <thead className="bg-bg-weak-50">
                          <tr>
                            <th className="w-16 border-b border-stroke-soft-200 bg-bg-weak-50 p-2 text-center">
                              <div className="flex justify-center">
                                <Checkbox.Root
                                  checked={
                                    selectedAssistants.length > 0 &&
                                    selectedAssistants.length ===
                                      assistantsData?.assistants.length
                                  }
                                  onCheckedChange={handleSelectAll}
                                />
                              </div>
                            </th>
                            <th className="border-b border-stroke-soft-200 bg-bg-weak-50 p-2 text-left text-label-sm text-text-soft-400">
                              アシスタント名
                            </th>
                            <th className="w-1/3 border-b border-stroke-soft-200 bg-bg-weak-50 p-2 text-left text-label-sm text-text-soft-400">
                              作成日時
                            </th>
                            <th className="w-[320px] border-b border-stroke-soft-200 bg-bg-weak-50 p-2 text-left text-label-sm text-text-soft-400">
                              説明
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {isAssistantsLoading || isDeferred ? (
                            <tr>
                              <td colSpan={3} className="p-4 text-center">
                                読み込み中...
                              </td>
                            </tr>
                          ) : assistantsData?.assistants.length === 0 ? (
                            <tr>
                              <td colSpan={3} className="p-4 text-center">
                                該当するアシスタントがありません
                              </td>
                            </tr>
                          ) : (
                            assistantsData?.assistants.map((assistant) => {
                              const isSelected = selectedAssistants.includes(
                                assistant.uuid
                              )

                              return (
                                <tr
                                  key={assistant.uuid}
                                  className="border-b border-stroke-soft-200 last:border-b-0"
                                >
                                  <td className="w-16 p-2 text-center">
                                    <div className="flex justify-center">
                                      <Checkbox.Root
                                        checked={isSelected}
                                        onCheckedChange={() =>
                                          toggleAssistantSelection(
                                            assistant.uuid
                                          )
                                        }
                                      />
                                    </div>
                                  </td>
                                  <td className="flex items-center gap-2 p-2">
                                    {assistant.icon ? (
                                      <Avatar.Root size="40">
                                        <Avatar.Image src={assistant.icon} />
                                      </Avatar.Root>
                                    ) : (
                                      <Avatar.Root
                                        size="40"
                                        placeholderType="user"
                                      />
                                    )}
                                    <p className="text-label-sm text-text-strong-950">
                                      {assistant.name}
                                    </p>
                                  </td>
                                  <td className="p-2 text-paragraph-sm text-text-strong-950">
                                    {formatDateTime(assistant.createdAt)}
                                  </td>
                                  <td className="w-[320px] overflow-hidden text-ellipsis p-2">
                                    <p className="line-clamp-2 text-paragraph-sm text-text-strong-950">
                                      {assistant.description}
                                    </p>
                                  </td>
                                </tr>
                              )
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  // Step 2: セクション選択画面
                  <>
                    <div className="mb-4">
                      <p className="mb-3 text-label-sm text-text-strong-950">
                        各アシスタントを配置するセクションを選択してください
                      </p>
                      <div className="rounded-lg border border-stroke-soft-200">
                        <table className="w-full overflow-hidden rounded-md">
                          <thead className="bg-bg-weak-50">
                            <tr>
                              <th className="border-b border-stroke-soft-200 p-2 text-left text-label-sm text-text-soft-400">
                                アシスタント名
                              </th>
                              <th className="w-1/3 border-b border-stroke-soft-200 p-2 text-left text-label-sm text-text-soft-400">
                                セクション
                              </th>
                            </tr>
                          </thead>
                          <tbody className="relative">
                            {selectedAssistants.length === 0 ? (
                              <tr>
                                <td colSpan={2} className="p-4 text-center">
                                  アシスタントが選択されていません
                                </td>
                              </tr>
                            ) : (
                              assistantsData?.assistants
                                .filter((assistant) =>
                                  selectedAssistants.includes(assistant.uuid)
                                )
                                .map((assistant) => {
                                  const assistantIndex =
                                    assistantTemplates?.findIndex(
                                      (template) =>
                                        template.assistantUuid ===
                                        assistant.uuid
                                    )
                                  const selectedSectionUuid =
                                    assistantIndex !== -1 &&
                                    assistantIndex !== undefined
                                      ? assistantTemplates[assistantIndex]
                                          ?.templateSectionUuid
                                      : ''

                                  return (
                                    <tr
                                      key={assistant.uuid}
                                      className="border-b border-stroke-soft-200 last:border-b-0"
                                    >
                                      <td className="p-2">
                                        <div className="flex items-center gap-2">
                                          {assistant.icon ? (
                                            <Avatar.Root size="40">
                                              <Avatar.Image
                                                src={assistant.icon}
                                              />
                                            </Avatar.Root>
                                          ) : (
                                            <Avatar.Root
                                              size="40"
                                              placeholderType="user"
                                            />
                                          )}
                                          <p className="text-label-sm text-text-strong-950">
                                            {assistant.name}
                                          </p>
                                        </div>
                                      </td>
                                      <td className="p-2">
                                        <div className="relative">
                                          <SectionSelectDropdown
                                            options={
                                              sections?.sections.map((s) => ({
                                                id: s.uuid,
                                                label: s.name,
                                                value: s.uuid,
                                              })) ?? []
                                            }
                                            value={selectedSectionUuid}
                                            onValueChange={(value) =>
                                              handleSelectSection(
                                                value,
                                                assistant.uuid
                                              )
                                            }
                                            className="w-full"
                                          />
                                          {assistantIndex !== -1 &&
                                            assistantIndex !== undefined &&
                                            errors.assistantTemplates?.[
                                              assistantIndex
                                            ]?.templateSectionUuid && (
                                              <p className="text-paragraph-xs text-red-500">
                                                セクションを選択してください
                                              </p>
                                            )}
                                        </div>
                                      </td>
                                    </tr>
                                  )
                                })
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}

                {errors.assistantTemplates && (
                  <p className="text-paragraph-xs text-red-500">
                    {errors.assistantTemplates.message}
                  </p>
                )}
              </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer
          className={cn(
            'flex justify-end gap-2',
            currentStep === 'SELECT_SECTIONS' && 'justify-between'
          )}
        >
          {currentStep === 'SELECT_SECTIONS' && (
            <Button.Root
              variant="neutral"
              mode="stroke"
              size="small"
              onClick={goToPreviousStep}
              type="button"
            >
              <Button.Icon as={RiArrowLeftLine} />
            </Button.Root>
          )}
          {currentStep === 'SELECT_ASSISTANTS' ? (
            <Button.Root
              variant="primary"
              mode="filled"
              size="small"
              onClick={goToNextStep}
              disabled={selectedAssistants.length === 0}
              className="w-40"
            >
              次に進む
            </Button.Root>
          ) : (
            <div className="flex justify-end gap-2">
              <Modal.Close asChild>
                <Button.Root
                  variant="neutral"
                  mode="stroke"
                  size="small"
                  className="w-40"
                >
                  キャンセル
                </Button.Root>
              </Modal.Close>
              <Button.Root
                isLoading={isSubmitting}
                variant="primary"
                mode="filled"
                size="small"
                type="submit"
                form="create-templates-form"
                className="w-40"
              >
                登録する
              </Button.Root>
            </div>
          )}
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  )
}
