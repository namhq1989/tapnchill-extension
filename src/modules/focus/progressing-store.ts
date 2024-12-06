import { FocusView, IFocusProgressingStore } from '@/modules/focus/types.ts'
import { create } from 'zustand'
import useFocusUIStore from '@/modules/focus/ui-store.ts'
import {
  stopBlocking,
  updateBlockingRules,
} from '@/modules/focus/sites-blocking.ts'
import useFocusSetupStore from '@/modules/focus/setup-store.ts'

const persistProgressState = (state: {
  initialCountdown: number
  countdown: number
  isRunning: boolean
  lastUpdated: number
}) => {
  chrome.storage.local.set({ focusProgress: state }, () => {
    console.log('Progress state persisted:', state)
  })
}

const useFocusProgressingStore = create<IFocusProgressingStore>((set, get) => ({
  initialCountdown: 1500, // Default 25 minutes in seconds
  countdown: 1500, // Initialize countdown to match initialCountdown
  isRunning: false,
  progress: 0,

  // Persist initialCountdown and countdown
  setInitialCountdown: (value: number) => {
    set(() => ({
      initialCountdown: value,
      countdown: value,
      progress: 0,
      isRunning: true,
    }))

    persistProgressState({
      initialCountdown: value,
      countdown: value,
      isRunning: get().isRunning,
      lastUpdated: Date.now(),
    })
  },

  setCountdown: (value: number) => {
    const { isRunning, initialCountdown } = get()
    const progress = ((initialCountdown - value) / initialCountdown) * 100

    set(() => ({
      countdown: value,
      progress,
    }))

    persistProgressState({
      initialCountdown, // Persist the current initialCountdown value
      countdown: value,
      isRunning,
      lastUpdated: Date.now(),
    })
  },

  toggleRunning: () => {
    const currentState = get()

    if (!currentState.isRunning) {
      const countdownInMinutes = currentState.countdown / 60

      chrome.alarms
        .create('focusCountdown', {
          delayInMinutes: countdownInMinutes,
        })
        .then()
      console.log(`Alarm created: ${countdownInMinutes} minutes remaining`)

      const { blockedSites } = useFocusSetupStore.getState()
      if (blockedSites.length) {
        updateBlockingRules(blockedSites)
      }
    } else {
      chrome.alarms.clear('focusCountdown', () => {
        console.log('Alarm cleared')
      })

      stopBlocking()
    }

    set((state) => ({
      isRunning: !state.isRunning,
    }))

    persistProgressState({
      initialCountdown: currentState.initialCountdown,
      countdown: currentState.countdown,
      isRunning: !currentState.isRunning,
      lastUpdated: Date.now(),
    })
  },

  resetProgress: () => {
    const { initialCountdown } = get()

    chrome.alarms.clear('focusCountdown', () => {
      console.log('Alarm cleared on reset')
    })

    set(() => ({
      initialCountdown,
      countdown: initialCountdown,
      isRunning: false,
      progress: 0,
    }))

    persistProgressState({
      initialCountdown,
      countdown: initialCountdown,
      isRunning: false,
      lastUpdated: Date.now(),
    })

    stopBlocking()
  },

  stopFocus: () => {
    get().resetProgress()

    const { switchView } = useFocusUIStore.getState()
    switchView(FocusView.setup)
  },
}))

export default useFocusProgressingStore
