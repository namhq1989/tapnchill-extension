import { FocusStatus } from '@/modules/focus/types.ts'

const getProgressStateFromStorage = (
  callback: (
    state: {
      focusSeconds: number
      breakSeconds: number
      numOfCycles: number
      currentCountdownSeconds: number
      currentCycleCount: number
      status: FocusStatus
      lastUpdated: number
    } | null,
  ) => void,
) => {
  chrome.storage.local.get(['focusProgress'], (result) => {
    callback(result.focusProgress || null)
  })
}

const persistProgressState = (state: {
  focusSeconds: number
  breakSeconds: number
  numOfCycles: number
  currentCountdownSeconds: number
  currentCycleCount: number
  status: FocusStatus
  lastUpdated: number
}) => {
  chrome.storage.local.set({ focusProgress: state }, () => {
    // console.log('Progress state persisted:', state)
  })
}

export { getProgressStateFromStorage, persistProgressState }
