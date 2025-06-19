import { create } from 'zustand'

import {
  Filter as FilterType,
  Sort,
} from '../api/getDiscoverAssistantTemplates'
import { AssistantTemplateSection } from '../api/getTemplateAssistantSections'

export type FilterWithoutQuery = Omit<FilterType, 'query'>

const DELAY_MS = 1000

// メニュー項目の型定義
export type MenuItem = {
  label: string
  key: string
}

interface DiscoverAssistantTemplatesStore {
  query: string
  deferredQuery: string
  isDeferred: boolean
  filters: FilterWithoutQuery
  activeSection: string

  setQuery: (query: string) => void
  setFilter: (filter: Partial<FilterWithoutQuery>) => void
  clearFilters: () => void
  setActiveSection: (sectionId: string) => void
  reset: () => void
}

let timer: ReturnType<typeof setTimeout> | null = null

export const useDiscoverAssistantTemplatesStore =
  create<DiscoverAssistantTemplatesStore>((set, get) => ({
    query: '',
    deferredQuery: '',
    isDeferred: false,
    filters: {},
    activeSection: 'all',

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

    setActiveSection: (sectionId: string) => {
      set({ activeSection: sectionId })
      const state = get()
      state.setFilter({
        section_uuid: sectionId !== 'all' ? sectionId : undefined,
      })
    },

    reset: () =>
      set({
        query: '',
        deferredQuery: '',
        isDeferred: false,
        filters: {},
        activeSection: 'all',
      }),
  }))

export const useDiscoverAssistantTemplatesKey = () => {
  const store = useDiscoverAssistantTemplatesStore()

  // 明示的にソート型を指定
  const sort: Sort = {
    type: 'name',
    direction: 'asc',
  }

  const request = {
    filter: {
      query: store.deferredQuery,
      ...store.filters,
    },
    // ソートは固定でname順
    sort,
  }

  return request
}

/**
 * セクション関連のヘルパー関数
 */
export const useAssistantTemplateSectionHelpers = (sections?: {
  sections: AssistantTemplateSection[]
}) => {
  const { activeSection } = useDiscoverAssistantTemplatesStore()

  // セクションからメニュー項目を作成
  const menuItems: MenuItem[] = [
    { label: '全て', key: 'all' },
    ...(sections?.sections.map((section) => ({
      label: section.name,
      key: section.uuid,
    })) || []),
  ]

  // 選択中のセクション名を取得
  const selectedSectionName =
    activeSection === 'all'
      ? '全て'
      : sections?.sections.find((section) => section.uuid === activeSection)
          ?.name || '全て'

  return {
    menuItems,
    selectedSectionName,
  }
}
