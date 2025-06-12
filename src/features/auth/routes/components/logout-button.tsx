'use client'

import * as Button from '@/components/ui/button'

import { RiLogoutBoxRLine } from '@remixicon/react'
import { useLogout } from '../../api/logout'

type Props = {
  className?: string
}

export const LogoutButton = ({ className }: Props) => {
  const { trigger, isMutating } = useLogout()
  return (
    <Button.Root
      variant="neutral"
      mode="ghost"
      size="small"
      className={className}
      onClick={() => trigger()}
      disabled={isMutating}
    >
      <Button.Icon>
        <RiLogoutBoxRLine className="size-5" />
      </Button.Icon>
    </Button.Root>
  )
}
