import * as Sidebar from '@/components/elements/siderbar'
import AskhubIcon from '../../../../public/vectors/logo.svg'
import { SidebarFooterItem } from './_components/sidebar-footer-item'
import { SidebarItems } from './_components/sidebar-items'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
