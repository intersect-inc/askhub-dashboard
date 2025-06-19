'use client'

import * as Modal from '@/components/ui/modal'
import { createContext, useContext, useState } from 'react'

import { RiErrorWarningFill } from '@remixicon/react'
import { LogoutButton } from './components/logout-button'

type SessionExpireModalContextType = {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

const SessionExpireModalContext = createContext<SessionExpireModalContextType>({
  isOpen: false,
  setIsOpen: () => {},
})

export const useSessionExpireModal = () => {
  const context = useContext(SessionExpireModalContext)
  if (!context) {
    throw new Error(
      'useSessionExpireModal must be used within SessionExpireModalProvider'
    )
  }
  return context
}

export const SessionExpireModalProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <SessionExpireModalContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
      <SessionExpireModal />
    </SessionExpireModalContext.Provider>
  )
}

export const SessionExpireModal = () => {
  const { isOpen, setIsOpen } = useSessionExpireModal()

  return (
    <Modal.Root open={isOpen} onOpenChange={setIsOpen}>
      <Modal.Content
        showClose={false}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <Modal.Body className="flex items-start gap-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-10 bg-error-lighter">
            <RiErrorWarningFill className="size-6 text-error-base" />
          </div>
          <div className="space-y-1">
            <div className="text-label-md text-text-strong-950">
              セッションの期限が切れました
            </div>
            <div className="text-paragraph-sm text-text-sub-600">
              ログアウト後、もう一度ログインしてください
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <LogoutButton className="ml-auto" />
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  )
}

export const SessionExpireModalWithOverlay = () => {
  return (
    <div className="fixed flex h-screen w-screen items-center justify-center bg-bg-strong-950">
      <SessionExpireModal />
    </div>
  )
}
