import * as Divider from '@/components/ui/divider'
import { KeyIcons } from '@/components/ui/key-icons'
import { cn } from '@/utils/cn'
import { RiArrowRightSLine } from '@remixicon/react'
import React, { ReactNode } from 'react'

type PageHeaderProps = {
  title: string
  description: string
  leftIcon?: React.ReactNode
  children?: React.ReactNode
}

export const PAGE_HEADER_ID = 'page-header'

export const PageHeader = ({
  title,
  description,
  leftIcon,
  children,
}: PageHeaderProps) => {
  return (
    <div className="mx-8 flex items-center justify-between gap-3 border-b border-stroke-soft-200 py-5">
      <div className="flex items-center gap-3">
        {leftIcon && (
          <KeyIcons size="lg" kStyle="stroke" color="gray">
            {leftIcon}
          </KeyIcons>
        )}
        <div className="flex flex-col gap-1">
          <h1 className="text-label-md text-text-strong-950">{title}</h1>
          <p className="text-paragraph-sm text-text-sub-600">{description}</p>
        </div>
      </div>
      {children}
    </div>
  )
}

export const BreadcrumbPageHeader = (props: {
  breadcrumbItems: ReactNode[]
  className?: string
  children?: ReactNode
}) => {
  const { breadcrumbItems, className, children } = props
  return (
    <div
      className={cn('flex w-full flex-col px-8', className)}
      id={PAGE_HEADER_ID}
    >
      <div className="flex min-h-[88px] items-center justify-between gap-3 py-5">
        <div className="flex w-fit items-center gap-1">
          {breadcrumbItems.map((item, index) =>
            index == 0 ? (
              <React.Fragment key={index}>{item}</React.Fragment>
            ) : (
              <React.Fragment key={index}>
                <span className="inline-block shrink-0">
                  <RiArrowRightSLine className="text-text-soft-400" />
                </span>
                {item}
              </React.Fragment>
            )
          )}
        </div>
        {children}
      </div>
      <Divider.Root />
    </div>
  )
}
