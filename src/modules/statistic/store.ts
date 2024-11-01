import { create } from 'zustand'
import {
  IStatisticListeningTrackingTimeItem,
  IStatisticStore,
} from '@/modules/statistic/types.ts'

const DEFAULT_PREVIOUS_DAYS = 7

const useStatisticStore = create<IStatisticStore>((set) => ({
  listeningTrackingTime: [],
  fetchListeningTrackingTime: () => {
    chrome.runtime.sendMessage(
      { type: 'get-listening-tracking-time-data' },
      ({ data }) => {
        if (!Array.isArray(data)) return

        const dates = getPreviousDates(DEFAULT_PREVIOUS_DAYS)
        const list: IStatisticListeningTrackingTimeItem[] = []

        for (const date of dates) {
          const item = data.find((e) => e.date === date)
          if (!item) {
            list.push({
              date,
              seconds: 0,
              minutes: 0,
            })
          } else {
            list.push({
              date,
              seconds: item.seconds,
              minutes: Math.ceil(item.seconds / 60),
            })
          }
        }

        set({ listeningTrackingTime: list.reverse() })
      },
    )
  },
}))

const getPreviousDates = (numOfDays: number): string[] => {
  const result = []
  const currentDate = new Date()

  for (let i = 0; i < numOfDays; i++) {
    const day = String(currentDate.getDate()).padStart(2, '0')
    const month = String(currentDate.getMonth() + 1).padStart(2, '0') // Months are 0-indexed
    result.push(`${day}/${month}`)

    currentDate.setDate(currentDate.getDate() - 1)
  }

  return result
}

export default useStatisticStore
