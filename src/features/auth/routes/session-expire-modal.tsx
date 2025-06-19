'use client'

import * as Modal from '@/components/ui/modal'
import { RiErrorWarningFill } from '@remixicon/react'
import { LogoutButton } from './components/logout-button'

export const SessionExpireModal = () => {
  return (
    <Modal.Root open={true}>
      <Modal.Content showClose={false}>
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
          <LogoutButton variant="text" className="ml-auto" />
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  )
}

export const SessionExpireModalWithOverlay = () => {
  return <SessionExpireModal />
}
