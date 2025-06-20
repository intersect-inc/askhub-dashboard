import { AdminMessage } from '@/features/logs/api/getMessages'
import { create } from 'zustand'

type MessageDrawerStore = {
  open: boolean
  selectedMessage: AdminMessage | null
  setOpen: (open: boolean) => void
  setSelectedMessage: (message: AdminMessage | null) => void
  reset: () => void
}

export const useMessageDrawerStore = create<MessageDrawerStore>((set, get) => ({
  open: false,
  selectedMessage: null,
  setOpen: (open) => set({ open }),
  setSelectedMessage: (message) => {
    const currentMessage = get().selectedMessage
    if (message?.message.uuid === currentMessage?.message.uuid) {
      set({ open: false, selectedMessage: null })
    } else if (message === null) {
      set({ open: false, selectedMessage: null })
    } else {
      set({ open: true, selectedMessage: message })
    }
  },
  reset: () => set({ open: false, selectedMessage: null }),
}))
