import { create } from 'zustand'
import {
  IGetQuoteApiResponse,
  IQuote,
  IQuoteStore,
} from '@/modules/quote/types.ts'
import useHttpStore from '@/modules/http/store.ts'

const FETCH_QUOTE_INTERVAL = 3600000 // 1 hour

const useQuoteStore = create<IQuoteStore>((set) => ({
  quote: null,
  getQuote: async () => {
    chrome.storage.local.get(async (result) => {
      const now = new Date()
      const quoteStr: string = result.quote || ''
      const quoteLastFetchTs: number = result.quoteLastFetchTs || 0

      if (quoteStr && quoteLastFetchTs > 0) {
        const diff = now.getTime() - quoteLastFetchTs
        if (diff < FETCH_QUOTE_INTERVAL) {
          const quote = JSON.parse(quoteStr) as IQuote
          set({ quote })
          return
        }
      }

      const { get: httpGet } = useHttpStore.getState()
      const response = await httpGet<IGetQuoteApiResponse>(
        'api/common/quote',
        {},
      )
      if (response && response.quote) {
        set({
          quote: response.quote,
        })
        chrome.storage.local
          .set({
            quote: JSON.stringify(response.quote),
            quoteLastFetchTs: now.getTime(),
          })
          .then()
      }
    })
  },
}))

export default useQuoteStore
