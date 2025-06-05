import * as FancyButton from '@/components/ui/fancy-button'
import { singUp } from '@/lib/next-auth'

type Props = {
  className?: string
}

async function handleSignUp() {
  'use server'
  await singUp()
}

export const RegisterButton = ({ className }: Props) => {
  return (
    <form action={handleSignUp} className={className}>
      <FancyButton.Root
        variant="neutral"
        size="medium"
        type="submit"
        className="w-full"
      >
        新規登録
      </FancyButton.Root>
    </form>
  )
}
