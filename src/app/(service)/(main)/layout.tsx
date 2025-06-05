import * as Sidebar from '@/components/elements/siderbar'
import AskhubIcon from '../../../../public/vectors/logo.svg'
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
        <Sidebar.Footer>フッターコンテンツ</Sidebar.Footer>
      </Sidebar.Root>
      {children}
    </div>
  )
}
