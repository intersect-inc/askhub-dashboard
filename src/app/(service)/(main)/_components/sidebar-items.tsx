'use client'

import * as Sidebar from '@/components/elements/siderbar'
import * as Button from '@/components/ui/button'
import { useDarkMode } from '@/hooks/useDarkMode'
import { cn } from '@/utils/cn'
import {
  RiFileTextLine,
  RiGroupLine,
  RiHistoryLine,
  RiMoonLine,
  RiSunLine,
} from '@remixicon/react'
import { usePathname, useRouter } from 'next/navigation'

// FIXME:これってどこかに切り出したほうがいい？
const items = [
  {
    label: 'ワークスペース一覧',
    href: '/workspaces',
    icon: RiGroupLine,
  },
  {
    label: 'アシスタントテンプレート',
    href: '/templates',
    icon: RiFileTextLine,
  },
  {
    label: 'ログ',
    href: '/logs',
    icon: RiHistoryLine,
  },
]

export const SidebarItems = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { isDark, toggle } = useDarkMode()

  return (
    <Sidebar.Content>
      {items.map((item) => (
        <Sidebar.Item
          key={item.href}
          icon={item.icon}
          label={item.label}
          active={item.href === pathname}
          onClick={() => {
            router.push(item.href)
          }}
          className={cn('cursor-pointer')}
        />
      ))}

      {/* Dark Mode Toggle */}
      <div className="mt-auto flex items-center justify-between">
        <Button.Root
          variant="neutral"
          mode="stroke"
          size="small"
          onClick={toggle}
          className="size-8 p-0"
        >
          {isDark ? (
            <RiMoonLine className="size-4" />
          ) : (
            <RiSunLine className="size-4" />
          )}
        </Button.Root>
      </div>
    </Sidebar.Content>
  )
}
