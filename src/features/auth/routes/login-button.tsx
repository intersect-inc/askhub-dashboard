'use client'

import * as Button from '@/components/ui/button'
import { handleSignIn } from '../actions/sign-in'

type Props = {
  className?: string
}

export const LoginButton = ({ className }: Props) => {
  return (
    <Button.Root
      variant="primary"
      mode="filled"
      size="medium"
      className={className}
      onClick={() => handleSignIn()}
    >
      ログイン
    </Button.Root>
  )
}
