import { memo } from 'react'

import * as Alert from '@/components/ui/alert'

import { ToastStatus } from './type'

type InlineToastProps = {
  id: number
  text: string
  status: ToastStatus
  onClose?: (id: number) => void
  className?: string
}

export const InlineToast = memo<InlineToastProps>(
  ({ id, status, text, onClose, className }) => {
    return (
      <Alert.Root size="small" status={status} className={className}>
        {text}
        {onClose && <Alert.CloseIcon as="button" onClick={() => onClose(id)} />}
      </Alert.Root>
    )
  }
)

InlineToast.displayName = 'InlineToast'
