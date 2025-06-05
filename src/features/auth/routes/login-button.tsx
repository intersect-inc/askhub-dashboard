import * as FancyButton from '@/components/ui/fancy-button'
import { signIn } from '@/lib/next-auth'

type Props = {
  className?: string
}

async function handleSignIn() {
  'use server'
  await signIn()
}

export const LoginButton = ({ className }: Props) => {
  return (
    <form action={handleSignIn} className={className}>
      <FancyButton.Root
        variant="primary"
        size="medium"
        type="submit"
        className="w-full"
      >
        ログイン
      </FancyButton.Root>
    </form>
  )
}
