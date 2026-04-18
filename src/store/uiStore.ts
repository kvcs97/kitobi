import { create } from 'zustand'

interface UIState {
  sidebarOpen: boolean
  activeSubjectId: string | null
  setSidebarOpen: (open: boolean) => void
  setActiveSubjectId: (id: string | null) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activeSubjectId: null,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setActiveSubjectId: (id) => set({ activeSubjectId: id }),
}))
