import { create } from 'zustand'

import {
  Filter as FilterType,
  Sort as SortType,
} from '../api/getDiscoverAssistants'

export type FilterWithoutQuery = Omit<FilterType, 'query'>

const DELAY_MS = 1000

interface DiscoverAssistantsStore {
  query: string
  deferredQuery: string
  isDeferred: boolean
  filters: FilterWithoutQuery
  sort?: SortType

  setQuery: (query: string) => void
  setFilter: (filter: Partial<FilterWithoutQuery>) => void
  clearFilters: () => void
  setSort: (sort?: SortType) => void
  reset: () => void
}

let timer: ReturnType<typeof setTimeout> | null = null

export const useDiscoverAssistantsStore = create<DiscoverAssistantsStore>(
  (set) => ({
    query: '',
    deferredQuery: '',
    isDeferred: false,
    filters: {},
    sort: { type: 'name', direction: 'asc' },

    setQuery: (newQuery: string) => {
      set({ query: newQuery, isDeferred: true })
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        set({ deferredQuery: newQuery, isDeferred: false })
      }, DELAY_MS)
    },

    setFilter: (filter) =>
      set((state) => ({
        filters: { ...state.filters, ...filter },
      })),

    clearFilters: () => set({ filters: {} }),
    setSort: (sort) => set({ sort }),
    reset: () =>
      set({
        query: '',
        deferredQuery: '',
        isDeferred: false,
        filters: {},
        sort: undefined,
      }),
  })
)

export const useDiscoverAssistantsKey = () => {
  const store = useDiscoverAssistantsStore()

  const request = {
    filter: {
      query: store.deferredQuery,
      ...store.filters,
    },
    sort: store.sort,
  }

  return request
}
