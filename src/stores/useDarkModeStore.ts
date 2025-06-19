import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface DarkModeState {
  isDark: boolean
  toggle: () => void
  setDark: (isDark: boolean) => void
}

export const useDarkModeStore = create<DarkModeState>()(
  persist(
    (set) => ({
      isDark: false,
      toggle: () =>
        set((state) => {
          const newIsDark = !state.isDark
          // Apply dark mode to document
          if (typeof window !== 'undefined') {
            if (newIsDark) {
              document.documentElement.classList.add('dark')
            } else {
              document.documentElement.classList.remove('dark')
            }
          }
          return { isDark: newIsDark }
        }),
      setDark: (isDark) =>
        set(() => {
          // Apply dark mode to document
          if (typeof window !== 'undefined') {
            if (isDark) {
              document.documentElement.classList.add('dark')
            } else {
              document.documentElement.classList.remove('dark')
            }
          }
          return { isDark }
        }),
    }),
    {
      name: 'dark-mode-storage',
      onRehydrateStorage: () => (state) => {
        // Apply dark mode on hydration
        if (typeof window !== 'undefined' && state) {
          if (state.isDark) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        }
      },
    }
  )
)
