import { FocusStatus, IFocusProgressingStore } from '@/modules/focus/types.ts'
import { create } from 'zustand'
import { getProgressStateFromStorage, persistProgressState } from './util'

const useFocusProgressingStore = create<IFocusProgressingStore>((set, get) => ({
  focusSeconds: 1500, // 25 minutes
  breakSeconds: 300, // 5 minutes
  numOfCycles: 2,
  currentCountdownSeconds: 1500,
  currentCycleCount: 0,
  progress: 0,
  status: FocusStatus.paused,
  startSession: (
    focusSeconds: number,
    breakSeconds: number,
    numOfCycles: number,
  ) => {
    set({
      focusSeconds,
      breakSeconds,
      numOfCycles,
      currentCountdownSeconds: focusSeconds,
      currentCycleCount: 0,
      progress: 0,
      status: FocusStatus.running,
    })

    persistProgressState({
      focusSeconds,
      breakSeconds,
      numOfCycles,
      currentCountdownSeconds: focusSeconds,
      currentCycleCount: 0,
      status: FocusStatus.running,
      lastUpdated: Date.now(),
    })
  },
  setRunning: () => {
    const { focusSeconds } = get()

    set({
      focusSeconds,
      currentCountdownSeconds: focusSeconds,
      progress: 0,
      status: FocusStatus.running,
    })

    getProgressStateFromStorage((savedState) => {
      if (savedState) {
        persistProgressState({
          ...savedState,
          focusSeconds,
          currentCountdownSeconds: focusSeconds,
          status: FocusStatus.running,
          lastUpdated: Date.now(),
        })
      }
    })
  },
  setResting: () => {
    const { breakSeconds } = get()

    set({
      breakSeconds,
      currentCountdownSeconds: breakSeconds,
      progress: 0,
      status: FocusStatus.resting,
    })

    getProgressStateFromStorage((savedState) => {
      if (savedState) {
        persistProgressState({
          ...savedState,
          breakSeconds,
          currentCountdownSeconds: breakSeconds,
          status: FocusStatus.resting,
          lastUpdated: Date.now(),
        })
      }
    })
  },

  setCurrentCountdownSeconds: (seconds: number) => {
    const { status, focusSeconds, breakSeconds } = get()

    let progress = 0
    if (status === FocusStatus.running) {
      progress = ((focusSeconds - seconds) / focusSeconds) * 100
    } else {
      progress = ((breakSeconds - seconds) / breakSeconds) * 100
    }

    set({
      currentCountdownSeconds: seconds,
      progress,
    })

    getProgressStateFromStorage((savedState) => {
      if (savedState) {
        persistProgressState({
          ...savedState,
          currentCountdownSeconds: seconds,
          lastUpdated: Date.now(),
        })
      }
    })
  },

  checkProgress: () => {
    const { status, numOfCycles, currentCycleCount } = get()

    if (status === FocusStatus.running) {
      // if numOfCycles is reached, stop the session
      if (currentCycleCount >= numOfCycles) {
        // stop the session
      } else {
        // change status to resting
      }
    } else if (status === FocusStatus.resting) {
      // if numOfCycles is reached, stop the session
      if (currentCycleCount >= numOfCycles) {
        // stop the session
      } else {
        // change status to running
        // increase currentCycleCount by 1
      }
    }
  },

  stopSession: () => {},

  // initialCountdown: 1500, // Default 25 minutes in seconds
  // countdown: 1500, // Initialize countdown to match initialCountdown
  // status: FocusStatus.paused,
  // progress: 0,
  // currentCycle: 0,
  //
  // startRunning: (focusSeconds: number, breakSeconds: number) => {},
  //
  // setRunning: (countdown: number) => {
  //   set({
  //     countdown,
  //     status: FocusStatus.running,
  //     progress: 0,
  //     currentCycle: 0,
  //   })
  // },
  //
  // // Persist initialCountdown and countdown
  // setInitialCountdown: (value: number) => {
  //   set({
  //     initialCountdown: value,
  //     countdown: value,
  //     progress: 0,
  //     status: FocusStatus.running,
  //     currentCycle: 0,
  //   })
  //
  //   persistProgressState({
  //     initialCountdown: value,
  //     countdown: value,
  //     status: get().status,
  //     lastUpdated: Date.now(),
  //     currentCycle: 0,
  //   })
  // },
  //
  // setCountdown: (value: number) => {
  //   const { status, initialCountdown, currentCycle } = get()
  //   const progress = ((initialCountdown - value) / initialCountdown) * 100
  //
  //   set(() => ({
  //     countdown: value,
  //     progress,
  //   }))
  //
  //   persistProgressState({
  //     initialCountdown, // Persist the current initialCountdown value
  //     countdown: value,
  //     status,
  //     lastUpdated: Date.now(),
  //     currentCycle,
  //   })
  // },
  //
  // toggleRunning: () => {
  //   const currentState = get()
  //
  //   let newStatus = FocusStatus.paused
  //   if (currentState.status === FocusStatus.paused) {
  //     newStatus = FocusStatus.running
  //   }
  //
  //   if (newStatus === FocusStatus.running) {
  //     const countdownInMinutes = currentState.countdown / 60
  //
  //     chrome.alarms
  //       .create('focusCountdown', {
  //         delayInMinutes: countdownInMinutes,
  //       })
  //       .then()
  //     console.log(`Alarm created: ${countdownInMinutes} minutes remaining`)
  //   } else {
  //     chrome.alarms.clear('focusCountdown', () => {
  //       console.log('Alarm cleared')
  //     })
  //   }
  //
  //   set({ status: newStatus })
  //
  //   persistProgressState({
  //     initialCountdown: currentState.initialCountdown,
  //     countdown: currentState.countdown,
  //     status: newStatus,
  //     lastUpdated: Date.now(),
  //     currentCycle: currentState.currentCycle,
  //   })
  // },
  //
  // resetProgress: () => {
  //   const { initialCountdown } = get()
  //
  //   chrome.alarms.clear('focusCountdown', () => {
  //     console.log('Alarm cleared on reset')
  //   })
  //
  //   set(() => ({
  //     initialCountdown,
  //     countdown: initialCountdown,
  //     status: FocusStatus.paused,
  //     progress: 0,
  //   }))
  //
  //   persistProgressState({
  //     initialCountdown,
  //     countdown: initialCountdown,
  //     status: FocusStatus.paused,
  //     lastUpdated: Date.now(),
  //     currentCycle: 0,
  //   })
  // },
  //
  // checkProgress: () => {
  //   const { currentCycle } = get()
  // },
  //
  // stopFocus: () => {
  //   get().resetProgress()
  //
  //   const { switchView } = useFocusUIStore.getState()
  //   switchView(FocusView.setup)
  // },
}))

export default useFocusProgressingStore
