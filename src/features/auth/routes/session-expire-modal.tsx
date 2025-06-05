import * as Modal from '@/components/ui/modal'
import { RiCloseLine } from '@remixicon/react'

import { LogoutButton } from './components/logout-button'

export const SessionExpireModal = () => {
  return (
    <Modal.Root>
      <Modal.Content>
        <RiCloseLine />
        <Modal.Title>セッションの期限が切れました</Modal.Title>
        <Modal.Description>
          ログアウト後、もう一度ログインしてください
        </Modal.Description>
      </Modal.Content>
      <Modal.Footer>
        <LogoutButton className="ml-auto" />
      </Modal.Footer>
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
