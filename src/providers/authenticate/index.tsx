import { Suspense } from 'react'

import { redirect } from 'next/navigation'

import * as Modal from '@/components/ui/modal'
import { SessionExpireModalWithOverlay } from '@/features/auth'
import { LogoutButton } from '@/features/auth/routes/components/logout-button'
import { getMeWithAuth } from '@/features/user/api/getMe'
import { auth } from '@/lib/next-auth'

import { Path } from '@/lib/path'
import { isAfterTime } from '@/utils/time'
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
          {/* <Logo className="size-20 shrink-0" /> */}
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
          <div className="bg-bg-strong-950/50 fixed flex h-screen w-screen items-center justify-center">
            <Modal.Root>
              <Modal.Content>
                <Modal.Title>ユーザー情報が取得できませんでした。</Modal.Title>
                <Modal.Description>
                  ログアウト後、もう一度ログインしてください
                </Modal.Description>
              </Modal.Content>
              <Modal.Footer>
                <LogoutButton className="ml-auto" />
              </Modal.Footer>
            </Modal.Root>
          </div>
          {children}
        </div>
      )
    }
  }

  if (!mePromise.value) {
    return (
      <div>
        <div className="bg-bg-strong-950/50 fixed flex h-screen w-screen items-center justify-center">
          <Modal.Root>
            <Modal.Content>
              <Modal.Title>ユーザー情報が取得できませんでした。</Modal.Title>
              <Modal.Description>
                ログアウト後、もう一度ログインしてください
              </Modal.Description>
            </Modal.Content>
            <Modal.Footer>
              <LogoutButton className="ml-auto" />
            </Modal.Footer>
          </Modal.Root>
        </div>
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
