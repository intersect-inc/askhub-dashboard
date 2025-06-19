'use client'

import * as Button from '@/components/ui/button'
import { handleSignUp } from '../actions/sign-up'

type Props = {
  className?: string
}

export const RegisterButton = ({ className }: Props) => {
  return (
    <Button.Root
      variant="primary"
      mode="filled"
      size="medium"
      className={className}
      onClick={() => handleSignUp()}
    >
      新規登録
    </Button.Root>
  )
}
