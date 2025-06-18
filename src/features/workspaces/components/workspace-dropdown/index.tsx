'use client'

import { RiMore2Line, RiProhibited2Line } from '@remixicon/react'

import * as Button from '@/components/ui/button'
import * as Divider from '@/components/ui/divider'
import * as Dropdown from '@/components/ui/dropdown'
import { DownloadModal } from '../download-modal'

type Props = {
  workspaceUuid: string
}

export const WorkspaceDropdown = ({ workspaceUuid }: Props) => {
  return (
    <>
      <Dropdown.Root>
        <Dropdown.Trigger asChild>
          <Button.Root variant="neutral" mode="stroke">
            <Button.Icon as={RiMore2Line} />
          </Button.Root>
        </Dropdown.Trigger>
        <Dropdown.Content align="start">
          <Dropdown.Group>
            <DownloadModal workspaceUuid={workspaceUuid} />
          </Dropdown.Group>
          <Divider.Root variant="line-spacing" />
          <Dropdown.Group>
            <Dropdown.Item className="text-error-base">
              <Dropdown.ItemIcon
                as={RiProhibited2Line}
                className="text-error-base"
              />
              利用を停止する
            </Dropdown.Item>
          </Dropdown.Group>
        </Dropdown.Content>
      </Dropdown.Root>
    </>
  )
}
