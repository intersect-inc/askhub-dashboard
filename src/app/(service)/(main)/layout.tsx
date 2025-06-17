'use client'

import * as Sidebar from '@/components/elements/siderbar'
import { useSidebarStore } from '@/stores/useSidebarStore'
import AskhubIcon from '../../../../public/vectors/logo.svg'
import { SidebarFooterItem } from './_components/sidebar-footer-item'
import { SidebarItems } from './_components/sidebar-items'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { collapsed, setHovered } = useSidebarStore()

  return (
    <div className="flex h-dvh max-h-dvh w-screen overflow-hidden">
      <Sidebar.Root className="h-dvh">
        <Sidebar.Header
          icon={<AskhubIcon className="size-8" />}
          title="Askhub"
          description="管理画面"
        />
        <SidebarItems />
        <Sidebar.Footer>
          <SidebarFooterItem />
        </Sidebar.Footer>
      </Sidebar.Root>
      <div
        className="absolute left-0 top-0 z-50 h-full w-4"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      <div
        className="min-w-0 flex-1 transition-all duration-200 ease-out"
        style={{
          marginLeft: collapsed ? '0px' : '288px',
        }}
      >
        {children}
      </div>
    </div>
  )
}
