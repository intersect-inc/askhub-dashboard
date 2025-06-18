'use client'

// import { AssistantAvatar } from '@/components/ui/avatar/misc/assistant-avatar'
import * as Avatar from '@/components/ui/avatar'
import * as Badge from '@/components/ui/badge'
// import {
//   DropdownItems,
//   DropdownMenuPortal,
//   DropdownMenuPortalRef,
// } from '@/components/ui/dropdown'

import { cn } from '@/utils/cn'
import { AssistantTemplate } from '../../api/getDiscoverAssistantTemplates'
import { TemplateDropdown } from './template-dropdowm'

export const TemplateCardLoader = () => {
  return (
    <div className="flex flex-col gap-[14px] rounded-xl border border-stroke-soft-200 p-4">
      <div className="flex items-center justify-between">
        <div className="size-10 rounded-full bg-gray-200" />
        <div className="size-7 rounded-lg bg-gray-200" />
      </div>
      <div className="flex flex-col gap-1">
        <div className="h-5 w-2/4 rounded-full bg-gray-200" />
        <div className="h-4 w-3/4 rounded-full bg-gray-200" />
        <div className="h-4 w-3/4 rounded-full bg-gray-200" />
      </div>
      <div className="h-5 w-1/3 rounded-full bg-gray-200" />
    </div>
  )
}

type TemplateCardProps = {
  data: AssistantTemplate
  onEdit?: (uuid: string) => void
  onDelete?: (uuid: string) => void
  className?: string
}

export const TemplateCard = ({
  data,
  //   onEdit,
  //   onDelete,
  className,
}: TemplateCardProps) => {
  //   const dropdownRef = useRef<DropdownMenuPortalRef>(null)

  //   const handleDeleteClick = () => {
  //     if (onDelete) {
  //       onDelete(data.uuid)
  //     }
  //   }

  //   const handleEditClick = () => {
  //     if (onEdit) {
  //       onEdit(data.uuid)
  //     }
  //   }

  return (
    <div
      className={cn(
        'flex flex-col gap-[14px] rounded-xl border border-stroke-soft-200 p-4',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <Avatar.Root asChild size="40">
          <a href="#">
            {data.icon ? (
              <Avatar.Image src={data.icon} />
            ) : (
              <Avatar.Root size="40" />
            )}
          </a>
        </Avatar.Root>
        <TemplateDropdown />
      </div>

      <div className="flex flex-col gap-1">
        <p className="truncate text-label-sm text-text-strong-950">
          {data.name}
        </p>
        {data.description && (
          <p className="line-clamp-2 whitespace-pre-line text-paragraph-xs text-text-sub-600">
            {data.description}
          </p>
        )}
      </div>

      {data.sectionName && (
        <Badge.Root
          color="gray"
          size="medium"
          variant="light"
          className="w-fit"
        >
          {data.sectionName}
        </Badge.Root>
      )}

      {/* <DropdownMenuPortal
        ref={dropdownRef}
        className="fixed m-1 max-w-60"
        onClick={(e) => {
          e.preventDefault()
          dropdownRef?.current?.toggle(e)
        }}
      >
        <DropdownItems className="flex flex-col gap-0.5">
          {onEdit && (
            <DropdownItems.Item
              leftIcon={<EditLineIcon />}
              label="テンプレートを編集する"
              onClick={() => handleEditClick()}
            />
          )}
          {onDelete && (
            <DropdownItems.Item
              leftIcon={<DeleteBinLineIcon />}
              labelClassName="text-state-error-base"
              label="テンプレートを削除する"
              onClick={() => handleDeleteClick()}
            />
          )}
        </DropdownItems>
      </DropdownMenuPortal> */}
    </div>
  )
}
