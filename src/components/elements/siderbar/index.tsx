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

import * as Button from '@/components/ui/button'

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

interface SidebarContextType {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextType | undefined>(
  undefined
)

const useSidebar = () => {
  const context = React.useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarRoot')
  }
  return context
}

const SidebarRoot = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    defaultCollapsed?: boolean
    onCollapsedChange?: (collapsed: boolean) => void
  }
>(
  (
    {
      className,
      defaultCollapsed = false,
      onCollapsedChange,
      children,
      ...rest
    },
    forwardedRef
  ) => {
    const [collapsed, setCollapsed] = React.useState(defaultCollapsed)

    const handleCollapsedChange = React.useCallback(
      (newCollapsed: boolean) => {
        setCollapsed(newCollapsed)
        onCollapsedChange?.(newCollapsed)
      },
      [onCollapsedChange]
    )

    const contextValue = React.useMemo(
      () => ({
        collapsed,
        setCollapsed: handleCollapsedChange,
      }),
      [collapsed, handleCollapsedChange]
    )

    return (
      <SidebarContext.Provider value={contextValue}>
        <div
          ref={forwardedRef}
          className={cn(
            // base
            'flex h-full flex-col border-r border-stroke-soft-200 bg-bg-white-0 transition-all duration-300',
            // width based on collapsed state
            collapsed ? 'w-16' : 'w-64',
            className
          )}
          {...rest}
        >
          {children}
        </div>
      </SidebarContext.Provider>
    )
  }
)
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
  const { collapsed, setCollapsed } = useSidebar()

  // アイコンの解決
  //   const IconComponent = typeof icon === 'string' ? iconMap[icon] : icon

  return (
    <div
      className={cn(
        'flex items-center border-b border-stroke-soft-200 px-4 py-3',
        !collapsed && 'gap-3',
        className
      )}
      {...rest}
    >
      {children || (
        <>
          {icon && (
            <div
              className={cn(
                'flex size-8 shrink-0 items-center justify-center rounded-lg bg-bg-white-0 transition-all duration-300',
                collapsed ? 'w-0 overflow-hidden opacity-0' : 'w-8 opacity-100'
              )}
            >
              {icon}
            </div>
          )}
          <div
            className={cn(
              'flex-1 space-y-0.5 transition-all duration-300',
              collapsed ? 'w-0 overflow-hidden opacity-0' : 'w-auto opacity-100'
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
            <Button.Root
              variant="neutral"
              mode="ghost"
              size="small"
              onClick={() => setCollapsed(!collapsed)}
            >
              <Button.Icon>
                {collapsed ? (
                  <RiArrowRightDoubleLine className="size-5 text-text-sub-600" />
                ) : (
                  <RiArrowLeftDoubleLine className="size-5 text-text-sub-600" />
                )}
              </Button.Icon>
            </Button.Root>
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
    const { collapsed } = useSidebar()

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
          // collapsed state
          collapsed && 'mx-auto w-8 justify-center gap-0 px-2',
          className
        )}
        title={collapsed ? label : undefined}
        {...rest}
      >
        {children || (
          <>
            {IconComponent && <IconComponent className="size-5 shrink-0" />}
            {!collapsed && (
              <span
                className={cn(
                  'flex-1 truncate transition-all duration-300',
                  'w-auto opacity-100'
                )}
              >
                {label}
              </span>
            )}
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
      className={cn('border-t border-stroke-soft-200 p-4', className)}
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
  useSidebar,
  type IconName,
}
