import {
  FocusStatus,
  FocusView,
  IFocusProgressingStore,
} from '@/modules/focus/types.ts'
import { create } from 'zustand'
import useFocusUIStore from '@/modules/focus/ui-store.ts'

const focusTexts = [
  'Time to Stay Focused',
  'Deep Work in Progress',
  'Focus and Stay Productive',
  'Concentrate on Your Goals',
]

const restTexts = [
  'Take a Short Break',
  'Relax and Recharge Yourself',
  'Time to Rest Now',
  'Breathe, Stretch, and Relax',
]

const useFocusProgressingStore = create<IFocusProgressingStore>((set, get) => ({
  countdownSeconds: 1500,
  currentCountdownSeconds: 1500,
  currentCycleCount: 0,
  progress: 0,
  status: FocusStatus.paused,
  numOfCycles: 0,

  startSession: (
    focusSeconds: number,
    breakSeconds: number,
    numOfCycles: number,
  ) => {
    set({
      countdownSeconds: focusSeconds,
      currentCountdownSeconds: focusSeconds,
      numOfCycles,
    })

    chrome.runtime
      .sendMessage({
        type: 'focus-session-start',
        data: {
          focusSeconds,
          breakSeconds,
          numOfCycles,
        },
      })
      .then(() => {
        const { switchView } = useFocusUIStore.getState()
        switchView(FocusView.progressing)
      })
  },

  setRunning: (
    countdownSeconds: number,
    currentCountdownSeconds: number,
    currentCycleCount: number,
  ) => {
    set({
      countdownSeconds,
      currentCountdownSeconds,
      currentCycleCount,
      status: FocusStatus.running,
    })

    const { randomPhaseText } = get()
    randomPhaseText()
  },
  setResting: (
    countdownSeconds: number,
    currentCountdownSeconds: number,
    currentCycleCount: number,
  ) => {
    set({
      countdownSeconds,
      currentCountdownSeconds,
      currentCycleCount,
      status: FocusStatus.resting,
    })

    const { randomPhaseText } = get()
    randomPhaseText()
  },
  setCompleted: () => {
    set({
      currentCountdownSeconds: 0,
      status: FocusStatus.completed,
    })
  },

  setCurrentCountdownSeconds: (seconds: number) => {
    const { countdownSeconds } = get()

    const progress = ((countdownSeconds - seconds) / countdownSeconds) * 100
    set({
      currentCountdownSeconds: seconds,
      progress,
    })
  },

  stopSession: () => {
    set({
      currentCountdownSeconds: 0,
      progress: 0,
      status: FocusStatus.paused,
    })

    chrome.runtime
      .sendMessage({
        type: 'focus-session-stop',
      })
      .then(() => {
        const { switchView } = useFocusUIStore.getState()
        switchView(FocusView.setup)
      })
  },

  phaseText: '',
  randomPhaseText: () => {
    const { status } = get()

    const texts = status === FocusStatus.running ? focusTexts : restTexts
    const text = texts[Math.floor(Math.random() * texts.length)]
    set({ phaseText: text })
  },
}))

export default useFocusProgressingStore
