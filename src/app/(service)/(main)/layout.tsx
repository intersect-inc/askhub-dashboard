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
    <div className="flex h-screen">
      <Sidebar.Root>
        <Sidebar.Header
          icon={<AskhubIcon className="size-6" />}
          title="Askhub"
          description="管理画面"
        />
        <SidebarItems />
        <Sidebar.Footer>
          <SidebarFooterItem />
        </Sidebar.Footer>
      </Sidebar.Root>
      {children}
    </div>
  )
}
