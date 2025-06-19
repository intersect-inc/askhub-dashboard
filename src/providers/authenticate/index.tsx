import { Suspense } from 'react'

import { redirect } from 'next/navigation'

import * as Modal from '@/components/ui/modal'
import { SessionExpireModalWithOverlay } from '@/features/auth'
import { LogoutButton } from '@/features/auth/routes/components/logout-button'
import { getMeWithAuth } from '@/features/user/api/getMe'
import { auth } from '@/lib/next-auth'
import { Path } from '@/lib/path'
import { isAfterTime } from '@/utils/time'
import { RiErrorWarningFill } from '@remixicon/react'
import Logo from '../../../public/vectors/logo.svg'
import { InitClientSideProvider } from '../init-client-side-provider'
export const AuthenticateProvider = async ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen flex-col items-center justify-center gap-2 bg-bg-white-0">
          <Logo className="size-20 shrink-0" />
        </div>
      }
    >
      <Internal>{children}</Internal>
    </Suspense>
  )
}

const Internal = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth()
  if (!session || !session.accessToken) {
    redirect(Path.signIn())
  }

  if (!session.emailVerified) {
    redirect(Path.verifyEmail())
  }

  if (isAfterTime(new Date(), session.expires)) {
    return (
      <div>
        <SessionExpireModalWithOverlay />
        {children}
      </div>
    )
  }

  const [mePromise] = await Promise.allSettled([
    getMeWithAuth(session.accessToken),
  ])

  if (mePromise.status === 'rejected') {
    if (mePromise.reason.response?.data.message === 'TOKEN_HAS_EXPIRED') {
      return (
        <div>
          <SessionExpireModalWithOverlay />
          {children}
        </div>
      )
    } else {
      return (
        <div>
          <Modal.Root open={true}>
            <Modal.Content showClose={false}>
              <Modal.Body className="flex items-start gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-10 bg-error-lighter">
                  <RiErrorWarningFill className="size-6 text-error-base" />
                </div>
                <div className="space-y-1">
                  <div className="text-label-md text-text-strong-950">
                    ユーザー情報が取得できませんでした。
                  </div>
                  <div className="text-paragraph-sm text-text-sub-600">
                    ログアウト後、もう一度ログインしてください
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <LogoutButton variant="text" className="ml-auto" />
              </Modal.Footer>
            </Modal.Content>
          </Modal.Root>
          {children}
        </div>
      )
    }
  }

  if (!mePromise.value) {
    return (
      <div>
        <Modal.Root open={true}>
          <Modal.Content showClose={false}>
            <Modal.Body className="flex items-start gap-4">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-10 bg-error-lighter">
                <RiErrorWarningFill className="size-6 text-error-base" />
              </div>
              <div className="space-y-1">
                <div className="text-label-md text-text-strong-950">
                  ユーザー情報が取得できませんでした。
                </div>
                <div className="text-paragraph-sm text-text-sub-600">
                  ログアウト後、もう一度ログインしてください
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <LogoutButton variant="text" className="ml-auto" />
            </Modal.Footer>
          </Modal.Content>
        </Modal.Root>
        {children}
      </div>
    )
  }

  if (!mePromise.value.user.emailVerified) {
    redirect(Path.verifyEmail())
  }

  return (
    <InitClientSideProvider token={session.accessToken}>
      {children}
    </InitClientSideProvider>
  )
}
