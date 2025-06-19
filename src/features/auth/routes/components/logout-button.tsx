'use client'

import * as Button from '@/components/ui/button'

import { RiLogoutBoxRLine } from '@remixicon/react'
import { useLogout } from '../../api/logout'

type Props = {
  className?: string
  variant?: 'icon' | 'text'
}

export const LogoutButton = ({ className, variant = 'icon' }: Props) => {
  const { trigger, isMutating } = useLogout()
  return (
    <Button.Root
      variant={variant === 'icon' ? 'neutral' : 'primary'}
      mode={variant === 'icon' ? 'ghost' : 'filled'}
      size="small"
      className={className}
      onClick={() => trigger()}
      disabled={isMutating}
    >
      <Button.Icon className={variant === 'icon' ? '' : 'w-full'}>
        {variant === 'icon' ? (
          <RiLogoutBoxRLine className="size-5" />
        ) : (
          <span>ログアウト</span>
        )}
      </Button.Icon>
    </Button.Root>
  )
}
