import { KeyIcons } from '@/components/ui/key-icons'
import { LoginButton } from '@/features/auth/routes/login-button'
import { RiUserLine } from '@remixicon/react'

export default function Home() {
  return (
    <div className="flex size-full flex-col items-center">
      <div className="flex items-center justify-center rounded-full bg-gradient-gray p-4">
        <KeyIcons
          kStyle="stroke"
          color="gray"
          size="2xl"
          className="bg-bg-white-0"
        >
          <RiUserLine />
        </KeyIcons>
      </div>
      <h1 className="mt-2 text-title-h5 text-text-strong-950">
        Askhub管理画面
      </h1>
      <p className="mt-4 text-center text-paragraph-md text-text-sub-600">
        インターセクトドメインのみログインできます。
      </p>
      <div className="mt-10 flex w-full gap-2">
        <LoginButton className="w-full" />
      </div>
    </div>
  )
}
