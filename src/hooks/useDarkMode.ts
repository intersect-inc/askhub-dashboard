import { useDarkModeStore } from '@/stores/useDarkModeStore'
import { useEffect } from 'react'

export const useDarkMode = () => {
  const { isDark, toggle, setDark } = useDarkModeStore()

  // Initialize dark mode on first load
  useEffect(() => {
    // Check system preference if no saved preference
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('dark-mode-storage')
      if (!savedTheme) {
        const prefersDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches
        setDark(prefersDark)
      }
    }
  }, [setDark])

  return {
    isDark,
    toggle,
    setDark,
  }
}
