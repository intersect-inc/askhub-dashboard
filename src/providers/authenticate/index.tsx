'use client'

import { SessionProvider, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

import {
  SessionExpireModalProvider,
  useSessionExpireModal,
} from '@/features/auth'
import { getMeWithAuth } from '@/features/user/api/getMe'
import { Path } from '@/lib/path'
// import { isAfterTime } from '@/utils/time'
import Logo from '../../../public/vectors/logo.svg'
import { InitClientSideProvider } from '../init-client-side-provider'

export const AuthenticateProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <SessionProvider>
      <Suspense
        fallback={
          <div className="flex h-screen w-screen flex-col items-center justify-center gap-2 bg-bg-white-0">
            <Logo className="size-20 shrink-0" />
          </div>
        }
      >
        <SessionExpireModalProvider>
          <Internal>{children}</Internal>
        </SessionExpireModalProvider>
      </Suspense>
    </SessionProvider>
  )
}

const Internal = ({ children }: { children: React.ReactNode }) => {
  const { setIsOpen } = useSessionExpireModal()
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const { data: session, status } = useSession()

  const isAfterTime = true

  useEffect(() => {
    const checkSession = async () => {
      if (status === 'loading') return

      if (!session || !session.accessToken) {
        router.push(Path.signIn())
        return
      }

      if (!session.emailVerified) {
        router.push(Path.verifyEmail())
        return
      }

      // if (isAfterTime(new Date(), session.expires)) {
      //   setIsOpen(true)
      //   return
      // }

      if (isAfterTime) {
        setIsOpen(true)
        return
      }

      try {
        const me = await getMeWithAuth(session.accessToken)

        if (!me) {
          setIsOpen(true)
          return
        }

        if (!me.user.emailVerified) {
          router.push(Path.verifyEmail())
          return
        }

        setToken(session.accessToken)
      } catch (error: any) {
        if (error.response?.data.message === 'TOKEN_HAS_EXPIRED') {
          setIsOpen(true)
          return
        }
      }
    }

    checkSession()
  }, [router, setIsOpen, session, status, isAfterTime])

  if (!token) {
    return null
  }

  return (
    <InitClientSideProvider token={token}>{children}</InitClientSideProvider>
  )
}
