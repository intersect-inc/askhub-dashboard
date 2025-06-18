'use client'

import { RiMoreFill } from '@remixicon/react'

import * as Button from '@/components/ui/button'
import * as Dropdown from '@/components/ui/dropdown'
import { useState } from 'react'
import { DeleteTemplateModal, EditTemplateModal } from '../template-modal'

export const TemplateDropdown = () => {
  const [open, setOpen] = useState(false)
  return (
    <Dropdown.Root open={open} onOpenChange={setOpen}>
      <Dropdown.Trigger asChild>
        <Button.Root
          variant="neutral"
          mode="stroke"
          size="xxsmall"
          onSelect={(e) => {
            e.preventDefault()
            setOpen(true)
          }}
        >
          <Button.Icon as={RiMoreFill} />
        </Button.Root>
      </Dropdown.Trigger>
      <Dropdown.Content align="start" className="w-fit">
        <Dropdown.Group>
          <EditTemplateModal />
          <DeleteTemplateModal />
        </Dropdown.Group>
      </Dropdown.Content>
    </Dropdown.Root>
  )
}
