'use client'

import { RiDraggable, RiEqualizer2Line } from '@remixicon/react'
import * as React from 'react'

import * as Button from '@/components/ui/button'
import * as Divider from '@/components/ui/divider'
import * as Input from '@/components/ui/input'
import * as Modal from '@/components/ui/modal'
import { toast } from '@/components/ui/toast'
import * as AlertToast from '@/components/ui/toast-alert'
import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { createAssistantTemplateSection } from '../../api/createAssistantTemplateSection'
import {
  AssistantTemplateSection,
  useAssistantTemplateSections,
} from '../../api/getAssistantTemplateSections'

import * as Label from '@/components/ui/label'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { deleteAssistantTemplateSection } from '../../api/deleteAssistantTemolateSection'
import { updateSectionsOrder } from '../../api/updateSectionOrder'
// セクション作成フォームのスキーマ
const sectionSchema = z.object({
  name: z.string().min(1, 'セクション名を入力してください'),
})

type SectionSchema = z.infer<typeof sectionSchema>

export const SectionSettingModal = () => {
  const [open, setOpen] = React.useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deletingUuid, setDeletingUuid] = useState<string | null>(null)
  const { data: sectionsData, mutate: mutateSections } =
    useAssistantTemplateSections()

  // ソート済みのセクションリスト
  const sortedSections = useMemo(() => {
    if (!sectionsData?.sections) return []
    return [...sectionsData.sections].sort(
      (a, b) => a.display_order - b.display_order
    )
  }, [sectionsData?.sections])

  // DnDセンサーの設定
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8ピクセル以上動かさないとドラッグ開始しない
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SectionSchema>({
    resolver: zodResolver(sectionSchema),
    mode: 'onChange',
  })

  const handleCreateSection = async (data: SectionSchema) => {
    try {
      setIsCreating(true)
      await createAssistantTemplateSection({ name: data.name })
      toast.custom(
        (t) => (
          <AlertToast.Root
            t={t}
            status="success"
            message="セクションを作成しました"
            variant="lighter"
          />
        ),
        {
          position: 'bottom-left',
        }
      )
      reset() // フォームをリセット
      mutateSections() // セクションリストを更新
    } catch (error) {
      toast.custom(
        (t) => (
          <AlertToast.Root
            t={t}
            status="error"
            message="セクションの作成に失敗しました"
            variant="lighter"
          />
        ),
        {
          position: 'bottom-left',
        }
      )
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteSection = async (uuid: string) => {
    try {
      setIsDeleting(true)
      setDeletingUuid(uuid)
      await deleteAssistantTemplateSection(uuid)
      toast.custom(
        (t) => (
          <AlertToast.Root
            t={t}
            status="success"
            message="セクションを削除しました"
            variant="lighter"
          />
        ),
        {
          position: 'bottom-left',
        }
      )
      mutateSections() // セクションリストを更新
    } catch (error: unknown) {
      const errorMessage =
        error &&
        typeof error === 'object' &&
        'response' in error &&
        error.response &&
        typeof error.response === 'object' &&
        'data' in error.response &&
        error.response.data &&
        typeof error.response.data === 'object' &&
        'detail' in error.response.data
          ? String(error.response.data.detail)
          : 'セクションの削除に失敗しました'

      toast.custom(
        (t) => (
          <AlertToast.Root
            t={t}
            status="error"
            message={errorMessage}
            variant="lighter"
          />
        ),
        {
          position: 'bottom-left',
        }
      )
    } finally {
      setIsDeleting(false)
      setDeletingUuid(null)
    }
  }

  // ドラッグ終了時の処理
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (!over || active.id === over.id || !sortedSections.length) {
      return
    }

    // 新しい順序を計算
    const oldIndex = sortedSections.findIndex(
      (section) => section.uuid === active.id
    )
    const newIndex = sortedSections.findIndex(
      (section) => section.uuid === over.id
    )

    if (oldIndex === -1 || newIndex === -1) {
      return
    }

    // ローカルでの表示順序を更新
    const newSections = arrayMove(sortedSections, oldIndex, newIndex)

    // 即時にUIを更新（mutateでローカルデータを更新）
    mutateSections(
      {
        sections: newSections.map((section, index) => ({
          ...section,
          display_order: index,
        })),
      },
      false
    ) // falseを渡してrevalidateしない

    try {
      // 新しい順序でAPIを呼び出し（バックグラウンドで実行）
      await updateSectionsOrder({
        sectionUuids: newSections.map((section) => section.uuid),
      })

      toast.custom(
        (t) => (
          <AlertToast.Root
            t={t}
            status="success"
            message="セクションの順序を更新しました"
            variant="lighter"
          />
        ),
        {
          position: 'bottom-left',
        }
      )

      // 成功したら改めてデータを再取得
      mutateSections()
    } catch (error) {
      toast.custom(
        (t) => (
          <AlertToast.Root
            t={t}
            status="error"
            message="セクションの順序の更新に失敗しました"
            variant="lighter"
          />
        ),
        {
          position: 'bottom-left',
        }
      )
      // エラー時は元の順序に戻す
      mutateSections()
    }
  }

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
          <Modal.Title>セクション管理</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              {/* セクション作成フォーム */}
              <form
                onSubmit={handleSubmit(handleCreateSection)}
                className="flex w-full items-end justify-between gap-3"
              >
                <div className="flex w-full flex-col gap-1.5">
                  <Label.Root>
                    セクション名
                    <Label.Asterisk />
                  </Label.Root>
                  <Input.Root hasError={!!errors.name}>
                    <Input.Wrapper>
                      <Input.Input
                        placeholder="新しいセクション名"
                        {...register('name')}
                      />
                    </Input.Wrapper>
                  </Input.Root>
                  {errors.name && (
                    <div className="text-paragraph-xs text-error-base">
                      {errors.name.message}
                    </div>
                  )}
                </div>
                <Button.Root
                  isLoading={isCreating}
                  size="small"
                  type="submit"
                  className="mb-[2px]"
                >
                  作成
                </Button.Root>
              </form>
            </div>

            <Divider.Root className="my-[1.5px]" />

            {/* セクション一覧 */}
            <div className="relative">
              <div>
                {sortedSections.length > 0 ? (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={sortedSections.map((section) => section.uuid)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="space-y-1">
                        {sortedSections.map((section) => (
                          <SortableSectionItem
                            key={section.uuid}
                            section={section}
                            isDeleting={isDeleting}
                            deletingUuid={deletingUuid}
                            onDelete={handleDeleteSection}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                ) : (
                  <div className="flex h-20 items-center justify-center rounded-lg border border-gray-200 bg-white">
                    <p className="text-gray-500">セクションがありません</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  )
}

// ソート可能なセクション行のコンポーネント
type SortableSectionItemProps = {
  section: AssistantTemplateSection
  isDeleting: boolean
  deletingUuid: string | null
  onDelete: (uuid: string) => void
}

const SortableSectionItem: FC<SortableSectionItemProps> = ({
  section,
  isDeleting,
  deletingUuid,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.uuid })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`mb-2 flex items-center justify-between rounded-lg border border-stroke-soft-200 bg-bg-white-0 p-3 ${
        isDragging ? 'bg-gray-100 opacity-70' : ''
      }`}
    >
      <div className="flex items-center gap-3">
        {/* ドラッグハンドルアイコン */}
        <span
          {...attributes}
          {...listeners}
          className="flex size-5 cursor-grab items-center justify-center rounded-md text-gray-500"
        >
          <RiDraggable size={16} />
        </span>
        <p className="text-label-sm text-text-strong-950">{section.name}</p>
      </div>
      <Button.Root
        isLoading={isDeleting && deletingUuid === section.uuid}
        variant="error"
        mode="stroke"
        size="xxsmall"
        type="button"
        onClick={() => onDelete(section.uuid)}
        className="gap-1 px-2"
      >
        削除
      </Button.Root>
    </div>
  )
}
