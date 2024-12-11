import {
  FocusStatus,
  FocusView,
  IFocusProgressingStore,
} from '@/modules/focus/types.ts'
import { create } from 'zustand'
import useFocusUIStore from '@/modules/focus/ui-store.ts'

const persistProgressState = (state: {
  initialCountdown: number
  countdown: number
  status: FocusStatus
  lastUpdated: number
  currentCycle: number
}) => {
  chrome.storage.local.set({ focusProgress: state }, () => {
    // console.log('Progress state persisted:', state)
  })
}

const useFocusProgressingStore = create<IFocusProgressingStore>((set, get) => ({
  initialCountdown: 1500, // Default 25 minutes in seconds
  countdown: 1500, // Initialize countdown to match initialCountdown
  status: FocusStatus.paused,
  progress: 0,
  currentCycle: 0,

  // Persist initialCountdown and countdown
  setInitialCountdown: (value: number) => {
    set({
      initialCountdown: value,
      countdown: value,
      progress: 0,
      status: FocusStatus.running,
      currentCycle: 0,
    })

    persistProgressState({
      initialCountdown: value,
      countdown: value,
      status: get().status,
      lastUpdated: Date.now(),
      currentCycle: 0,
    })
  },

  setCountdown: (value: number) => {
    const { status, initialCountdown, currentCycle } = get()
    const progress = ((initialCountdown - value) / initialCountdown) * 100

    set(() => ({
      countdown: value,
      progress,
    }))

    persistProgressState({
      initialCountdown, // Persist the current initialCountdown value
      countdown: value,
      status,
      lastUpdated: Date.now(),
      currentCycle,
    })
  },

  toggleRunning: () => {
    const currentState = get()

    let newStatus = FocusStatus.paused
    if (currentState.status === FocusStatus.paused) {
      newStatus = FocusStatus.running
    }

    if (newStatus === FocusStatus.running) {
      const countdownInMinutes = currentState.countdown / 60

      chrome.alarms
        .create('focusCountdown', {
          delayInMinutes: countdownInMinutes,
        })
        .then()
      console.log(`Alarm created: ${countdownInMinutes} minutes remaining`)
    } else {
      chrome.alarms.clear('focusCountdown', () => {
        console.log('Alarm cleared')
      })
    }

    set({ status: newStatus })

    persistProgressState({
      initialCountdown: currentState.initialCountdown,
      countdown: currentState.countdown,
      status: newStatus,
      lastUpdated: Date.now(),
      currentCycle: currentState.currentCycle,
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
      status: FocusStatus.paused,
      progress: 0,
    }))

    persistProgressState({
      initialCountdown,
      countdown: initialCountdown,
      status: FocusStatus.paused,
      lastUpdated: Date.now(),
      currentCycle: 0,
    })
  },

  checkProgress: () => {},

  stopFocus: () => {
    get().resetProgress()

    const { switchView } = useFocusUIStore.getState()
    switchView(FocusView.setup)
  },
}))

export default useFocusProgressingStore
