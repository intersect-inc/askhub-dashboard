'use client'

import * as Button from '@/components/ui/button'

import { useLogout } from '../../api/logout'

type Props = {
  className?: string
}

export const LogoutButton = ({ className }: Props) => {
  const { trigger, isMutating } = useLogout()
  return (
    <Button.Root
      variant="primary"
      size="small"
      className={className}
      onClick={() => trigger()}
      disabled={isMutating}
    >
      ログアウト
    </Button.Root>
  )
}
