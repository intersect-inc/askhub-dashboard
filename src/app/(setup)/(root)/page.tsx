import { LoginButton } from '@/features/auth/routes/login-button'
import { RegisterButton } from '@/features/auth/routes/register-button'

export default function Home() {
  return (
    <div className="p-8">
      <div className="flex w-full gap-2">
        <LoginButton />
        <RegisterButton />
      </div>
    </div>
  )
}
