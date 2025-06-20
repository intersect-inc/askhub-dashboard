import { AdminMessage } from '@/features/logs/api/getMessages'
import { create } from 'zustand'

type DrawerStore = {
  open: boolean
  selectedMessage: AdminMessage | null
  setOpen: (open: boolean) => void
  setSelectedMessage: (message: AdminMessage | null) => void
  reset: () => void
}

export const useDrawerStore = create<DrawerStore>((set, get) => ({
  open: false,
  selectedMessage: null,
  setOpen: (open) => set({ open }),
  setSelectedMessage: (message) => {
    const currentMessage = get().selectedMessage
    if (message?.message.uuid === currentMessage?.message.uuid) {
      set({ open: false, selectedMessage: null })
    } else if (message === null) {
      set({ open: false, selectedMessage: null })
    } else if (currentMessage === null) {
      set({ open: true, selectedMessage: message })
    } else {
      set({ open: false, selectedMessage: currentMessage })
      setTimeout(() => {
        set({ open: true, selectedMessage: message })
      }, 200)
    }
  },
  reset: () => set({ open: false, selectedMessage: null }),
}))
