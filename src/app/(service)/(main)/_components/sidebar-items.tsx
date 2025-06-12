'use client'

import * as Sidebar from '@/components/elements/siderbar'
import { cn } from '@/utils/cn'
import { RiFileTextLine, RiGroupLine, RiHistoryLine } from '@remixicon/react'
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
    </Sidebar.Content>
  )
}
