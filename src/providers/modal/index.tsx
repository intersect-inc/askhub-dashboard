'use client'

import { createContext, useCallback, useContext, useRef, useState } from 'react'

import { cn } from '@/utils/cn'

const TRANSITION_MS = 150

type ModalOption = {
  preventOverlayClose?: boolean
}

type ModalProps<T extends object = object> = T & {
  onClose?: () => void
}

type ModalPropsWithOption<T extends object = object> = ModalProps<T> &
  ModalOption

type ModalContextType<T extends ModalProps> = {
  setModal: (node: Node<T>, props: T) => void
  closeModal: () => void
  modalState: {
    FC: Node<T> | null
    props: T | null
  }
}

type Node<T extends ModalProps> = React.FC<T & ModalOption>

const createModalContext = <T extends ModalProps>() =>
  createContext<ModalContextType<T>>({} as ModalContextType<T>)

const ModalContext = createModalContext()

const useModal = <T extends ModalProps>(node: Node<T>) => {
  const { setModal, closeModal: close } = useContext(ModalContext)
  const open = useCallback(
    (props: T & ModalOption) => setModal(node as Node<ModalProps>, props),
    [setModal, node]
  )

  return {
    open,
    close,
  }
}

const ModalProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalState, setModalState] = useState<{
    FC: Node<ModalProps> | null
    props: ModalProps | null
  }>({
    FC: null,
    props: null,
  })

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  return (
    <ModalContext.Provider
      value={{
        setModal: useCallback((node, props) => {
          if (timerRef.current) {
            clearTimeout(timerRef.current)
          }
          setModalState((prev) => {
            if (!prev.FC) {
              return {
                FC: node as Node<ModalProps>,
                props,
              }
            }

            timerRef.current = setTimeout(() => {
              setModalState({
                FC: node as Node<object>,
                props,
              })
            }, TRANSITION_MS)
            return {
              FC: null,
              props: null,
            }
          })
        }, []),
        closeModal: useCallback(() => {
          setModalState({
            FC: null,
            props: null,
          })
        }, []),
        modalState,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

const ModalPortal = ({ children }: { children: React.ReactNode }) => {
  const { modalState, closeModal } = useContext(ModalContext)

  const { preventOverlayClose } =
    (modalState?.props as ModalPropsWithOption) ?? {}

  return (
    <>
      <div
        className={cn(
          'z-modal bg-overlay-overlay fixed left-0 top-0 h-screen w-screen backdrop-blur-sm transition-[opacity_visibility] ease-out',
          modalState?.FC ? 'visible opacity-100' : 'invisible opacity-0'
        )}
        onClick={!preventOverlayClose ? closeModal : undefined}
      >
        <div
          className={cn(
            'z-modal relative m-auto flex size-fit transition-all ease-out',
            modalState?.FC
              ? 'absolute-center-y visible opacity-100'
              : 'invisible top-[40%] translate-y-[-40%] opacity-0'
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {modalState?.FC && <modalState.FC {...(modalState?.props || {})} />}
        </div>
      </div>
      {children}
    </>
  )
}

export { ModalPortal, ModalProvider, useModal, type ModalProps }
