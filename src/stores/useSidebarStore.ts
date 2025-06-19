import { create } from 'zustand'

interface SidebarState {
  collapsed: boolean
  hovered: boolean
  setCollapsed: (collapsed: boolean) => void
  setHovered: (hovered: boolean) => void
  toggleCollapsed: () => void
}

export const useSidebarStore = create<SidebarState>((set) => ({
  collapsed: false,
  hovered: false,
  setCollapsed: (collapsed) => set({ collapsed }),
  setHovered: (hovered) => set({ hovered }),
  toggleCollapsed: () => set((state) => ({ collapsed: !state.collapsed })),
}))
