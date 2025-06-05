'use client'

import * as Sidebar from '@/components/elements/siderbar'
import { RiFileTextLine, RiFolderLine } from '@remixicon/react'
export const SidebarItems = () => {
  return (
    <Sidebar.Content>
      <Sidebar.Item icon={RiFolderLine} label="ワークスペース" active />
      <Sidebar.Item icon={RiFileTextLine} label="アシスタントテンプレート" />
      <Sidebar.Item icon={RiFileTextLine} label="ログ" />
    </Sidebar.Content>
  )
}
