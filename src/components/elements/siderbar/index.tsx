'use client'

import { cn } from '@/utils/cn'
import {
  RiArrowLeftDoubleLine,
  RiArrowRightDoubleLine,
  RiBarChartLine,
  RiBellLine,
  RiFileTextLine,
  RiHomeLine,
  RiMailLine,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
  RiSearchLine,
  RiSettingsLine,
  RiUserLine,
  type RemixiconComponentType,
} from '@remixicon/react'
import React from 'react'

import * as CompactButton from '@/components/ui/compact-button'
import { useSidebarStore } from '@/stores/useSidebarStore'

// アイコンマッピング
const iconMap = {
  home: RiHomeLine,
  settings: RiSettingsLine,
  user: RiUserLine,
  file: RiFileTextLine,
  chart: RiBarChartLine,
  mail: RiMailLine,
  search: RiSearchLine,
  bell: RiBellLine,
  'menu-fold': RiMenuFoldLine,
  'menu-unfold': RiMenuUnfoldLine,
} as const

type IconName = keyof typeof iconMap

const SidebarRoot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...rest }, forwardedRef) => {
  const { collapsed, hovered, setHovered } = useSidebarStore()

  return (
    <div
      ref={forwardedRef}
      data-sidebar="root"
      className={cn(
        // base
        'flex shrink-0 flex-col bg-bg-white-0',
        // smooth transitions for width changes
        'transition-all duration-200 ease-out',
        // positioning based on collapsed state
        collapsed
          ? 'fixed left-1 top-1 z-50'
          : 'fixed left-0 top-0 z-40 h-full',
        // border and corner styles with transition
        collapsed && hovered
          ? 'rounded-xl border border-stroke-soft-200'
          : collapsed && !hovered
            ? 'border-0'
            : 'border-r border-stroke-soft-200',
        // shadow effects based on state
        collapsed ? 'shadow-lg' : 'shadow-none',
        // width and slide transition
        collapsed && !hovered
          ? 'w-0 -translate-x-full overflow-hidden'
          : collapsed && hovered
            ? 'w-72 translate-x-0'
            : 'w-72 translate-x-0',
        className
      )}
      style={{
        height: collapsed ? 'calc(100vh - 8px)' : undefined,
        transitionProperty: 'all',
        transitionDuration: '200ms',
        transitionTimingFunction: 'ease-out',
      }}
      onMouseEnter={() => collapsed && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...rest}
    >
      {children}
    </div>
  )
})
SidebarRoot.displayName = 'SidebarRoot'

function SidebarHeader({
  className,
  children,
  icon,
  title,
  description,
  showToggle = true,
  ...rest
}: React.HTMLAttributes<HTMLDivElement> & {
  icon?: React.ReactNode
  title?: string
  description?: string
  showToggle?: boolean
}) {
  const { collapsed, toggleCollapsed } = useSidebarStore()

  return (
    <div
      className={cn(
        'mx-3 flex items-center gap-3 border-b border-stroke-soft-200 py-6',
        className
      )}
      {...rest}
    >
      {children || (
        <>
          {icon && (
            <div
              className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-lg bg-bg-white-0 transition-all duration-300',
                'w-10 opacity-100'
              )}
            >
              {icon}
            </div>
          )}
          <div
            className={cn(
              'flex-1 space-y-0.5 transition-all duration-300',
              'w-auto opacity-100'
            )}
          >
            {title && (
              <div className="truncate text-label-sm text-text-strong-950">
                {title}
              </div>
            )}
            {description && (
              <div className="truncate text-paragraph-xs text-text-sub-600">
                {description}
              </div>
            )}
          </div>
          {showToggle && (
            <CompactButton.Root
              variant="stroke"
              size="medium"
              onClick={toggleCollapsed}
            >
              <CompactButton.Icon>
                {collapsed ? (
                  <RiArrowRightDoubleLine className="size-4 text-text-sub-600" />
                ) : (
                  <RiArrowLeftDoubleLine className="size-4 text-text-sub-600" />
                )}
              </CompactButton.Icon>
            </CompactButton.Root>
          )}
        </>
      )}
    </div>
  )
}
SidebarHeader.displayName = 'SidebarHeader'

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...rest }, forwardedRef) => {
  return (
    <div
      ref={forwardedRef}
      className={cn(
        'flex w-full flex-1 flex-col gap-1 overflow-y-auto p-2',
        className
      )}
      {...rest}
    />
  )
})
SidebarContent.displayName = 'SidebarContent'

const SidebarItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    icon?: IconName | RemixiconComponentType
    label?: string
    active?: boolean
    disabled?: boolean
  }
>(
  (
    {
      className,
      children,
      icon,
      label,
      active = false,
      disabled = false,
      ...rest
    },
    forwardedRef
  ) => {
    const { collapsed } = useSidebarStore()

    // アイコンの解決
    const IconComponent = typeof icon === 'string' ? iconMap[icon] : icon

    return (
      <div
        ref={forwardedRef}
        className={cn(
          // base
          'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-paragraph-sm transition-all duration-300',
          // states
          'hover:bg-bg-weak-50 focus:outline-none focus:ring-2 focus:ring-stroke-strong-950',
          // active state
          active && 'bg-bg-weak-50 text-text-strong-950',
          // disabled state
          disabled && 'pointer-events-none opacity-50',
          // default state
          !active && !disabled && 'text-text-sub-600',
          // collapsed state - remove specific collapsed styling to show full content
          className
        )}
        title={collapsed ? label : undefined}
        {...rest}
      >
        {children || (
          <>
            {IconComponent && (
              <IconComponent className="size-5 shrink-0 text-text-sub-600" />
            )}
            <span
              className={cn(
                'flex-1 truncate text-text-strong-950 transition-all duration-300',
                'w-auto opacity-100'
              )}
            >
              {label}
            </span>
          </>
        )}
      </div>
    )
  }
)
SidebarItem.displayName = 'SidebarItem'

function SidebarFooter({
  className,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('mx-3 border-t border-stroke-soft-200 py-3', className)}
      {...rest}
    />
  )
}
SidebarFooter.displayName = 'SidebarFooter'

export {
  SidebarContent as Content,
  SidebarFooter as Footer,
  SidebarHeader as Header,
  SidebarItem as Item,
  SidebarRoot as Root,
  type IconName,
}
