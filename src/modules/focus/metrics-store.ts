import { create } from 'zustand'
import {
  IFocusDailyMetrics,
  IFocusMetricsStore,
  IFocusOverallMetrics,
} from '@/modules/focus/types.ts'

const useFocusMetricsStore = create<IFocusMetricsStore>(() => ({
  fetchOverallMetrics: (): Promise<IFocusOverallMetrics> => {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        { type: 'get-focus-overall-metrics' },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError)
          } else {
            resolve(response.data as IFocusOverallMetrics)
          }
        },
      )
    })
  },
  fetchTodayMetrics: (): Promise<IFocusDailyMetrics> => {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        { type: 'get-focus-today-metrics' },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError)
          } else {
            resolve(response.data as IFocusDailyMetrics)
          }
        },
      )
    })
  },
  fetchLastNDaysMetrics: (days: number): Promise<IFocusDailyMetrics[]> => {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        { type: 'get-focus-last-n-days-metrics', days: days },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError)
          } else {
            resolve(response.data as IFocusDailyMetrics[])
          }
        },
      )
    })
  },
}))

export default useFocusMetricsStore
