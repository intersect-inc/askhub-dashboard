'use client'

import {
  FC,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'

import { cn } from '@/utils/cn'

import { InlineToast } from './inline-toast'
import { ANIMATION_TIME_MS, TIMING_FUNC, TRANSITION_DURATION } from './style'
import { InlineToastInput, InlineToastType } from './type'

type ToastInterface = {
  setInlineToast: (toast: InlineToastInput) => number
}

const TOAST_DISPLAY_TIME_MS = 4500
const TOAST_MAX_ITEMS = 5

const ToastContext = createContext<ToastInterface>({} as ToastInterface)

const useToast = () => useContext(ToastContext)

const ToastProvider: FC<{
  children: ReactNode
}> = ({ children }) => {
  /**
   * animationとtoastのtimeoutのidを管理するためのstate
   */
  const [activeToastIds, setActiveToastIds] = useState<
    {
      id: number
      timeOutId: NodeJS.Timeout
    }[]
  >([])
  const [toasts, setToasts] = useState<InlineToastType[]>([])
  const removedToastIds = useRef<Map<number, null>>(new Map())

  /**
   * toastのanimation管理のstateから該当するtoast idを削除しtimeoutをclearする
   * その後、animationの終了を待ってからtoastを削除する
   */
  const removeToast = useCallback((id: number) => {
    setActiveToastIds((prev) => {
      const timeOutId = prev.find((toast) => toast.id === id)?.timeOutId
      if (timeOutId) {
        clearTimeout(timeOutId)
      }
      return prev.filter((toast) => toast.id !== id)
    })
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
      removedToastIds.current.set(id, null)
    }, ANIMATION_TIME_MS)
  }, [])

  const setInlineToast = useCallback((toast: InlineToastInput): number => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, ...toast }])
    const timeOutId = setTimeout(
      () => removeToast(id),
      TOAST_DISPLAY_TIME_MS
    ) as NodeJS.Timeout

    setActiveToastIds((prev) => {
      if (prev.length >= TOAST_MAX_ITEMS) {
        const target = prev.shift()
        if (target) {
          removeToast(target.id)
        }
      }
      return [...prev, { id, timeOutId }]
    })
    return id
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ToastContext.Provider value={{ setInlineToast }}>
      {children}
      <div
        className={cn(
          'z-toast transition-height fixed bottom-8 left-8 flex h-auto w-full max-w-[320px] flex-col',
          TRANSITION_DURATION,
          TIMING_FUNC
        )}
      >
        {toasts.map((toast) => (
          <InlineToast
            id={toast.id}
            key={toast.id}
            text={toast.text}
            status={toast.status}
            onClose={removeToast}
            className={cn(
              activeToastIds.some((activeToast) => activeToast.id === toast.id)
                ? 'animate-inline-toast-enter'
                : 'animate-inline-toast-leave'
            )}
          />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export { ToastProvider, useToast }
