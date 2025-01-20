import { create } from 'zustand/index'
import { IHighlight, IHighlightStore } from '@/modules/highlight/types.ts'

const useHighlightStore = create<IHighlightStore>((set) => ({
  highlights: [],
  initHighlights: async () => {
    chrome.storage.local.get('highlights', (result) => {
      const totalUrls = Object.keys(result.highlights || {}).length
      if (totalUrls === 0) {
        return
      }

      const data: IHighlight[] = Object.entries(result.highlights).map(
        ([
          url,
          items,
        ]: [
          string,
          unknown,
        ]) => {
          const parsedItems = JSON.parse(items as string) // Explicit cast to string
          return {
            url,
            numOfHighlights: Array.isArray(parsedItems)
              ? parsedItems.length
              : 0,
          }
        },
      )
      set({ highlights: data })
    })
  },
}))

export default useHighlightStore
