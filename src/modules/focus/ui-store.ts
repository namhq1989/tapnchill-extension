import { create } from 'zustand'
import {
  FocusStatus,
  FocusView,
  IBlockedSite,
  IFocusUIStore,
} from '@/modules/focus/types.ts'
import useFocusSetupStore from '@/modules/focus/setup-store.ts'
import { getProgressStateFromStorage } from '@/modules/focus/util.ts'
import useFocusProgressingStore from '@/modules/focus/progressing-store.ts'

const getBlockedSitesFromStorage = (
  callback: (sites: IBlockedSite[]) => void,
) => {
  chrome.storage.local.get(['blockedSites'], (result) => {
    callback(result.blockedSites || [])
  })
}

const persistCurrentView = (view: FocusView) => {
  chrome.storage.local.set({ focusCurrentView: view }, () => {
    console.log('Persisted current view to storage:', view)
  })
}

const getCurrentViewFromStorage = (callback: (view: FocusView) => void) => {
  chrome.storage.local.get(['focusCurrentView'], (result) => {
    // console.log('Focus current view', result)
    callback(result.focusCurrentView || FocusView.setup)
  })
}

const getSessionSettings = (
  callback: (settings: {
    focusTime: number
    breakTime: number
    numOfCycles: number
    isPlaySoundOnResting: boolean
  }) => void,
) => {
  chrome.storage.local.get(['focusSessionSettings'], (result) => {
    // console.log('Focus session settings', result)
    callback(result.focusSessionSettings || null)
  })
}

const useFocusUIStore = create<IFocusUIStore>((set) => ({
  isInitializing: false,
  initFocus: () => {
    set({
      isInitializing: true,
    })
    getCurrentViewFromStorage((view) => {
      set(() => ({ currentView: view }))
      console.log('Initialized current view from storage:', view)
    })

    getBlockedSitesFromStorage((sites) => {
      useFocusSetupStore.setState({ blockedSites: sites })
      console.log('Loaded blocked sites from local storage:', sites)
    })

    getSessionSettings((settings) => {
      if (settings) {
        useFocusSetupStore.setState({
          focusTime: settings.focusTime,
          breakTime: settings.breakTime,
          numOfCycles: settings.numOfCycles,
          isPlaySoundOnResting: settings.isPlaySoundOnResting,
        })
      }
    })

    getProgressStateFromStorage((savedState) => {
      if (savedState) {
        const {
          focusSeconds,
          breakSeconds,
          numOfCycles,
          currentCountdownSeconds,
          currentCycleCount,
          status,
          lastUpdated,
        } = savedState

        const isCounting =
          status === FocusStatus.running || status === FocusStatus.resting
        let remainingTime = 0
        if (isCounting) {
          const now = Date.now()
          const elapsed = Math.floor((now - lastUpdated) / 1000)
          remainingTime = Math.max(currentCountdownSeconds - elapsed, 0)
        }

        let progress = 0
        if (status === FocusStatus.running) {
          progress = ((focusSeconds - remainingTime) / focusSeconds) * 100
        } else if (status === FocusStatus.resting) {
          progress = ((breakSeconds - remainingTime) / breakSeconds) * 100
        }

        useFocusProgressingStore.setState({
          numOfCycles,
          countdownSeconds:
            status === FocusStatus.running ? focusSeconds : breakSeconds,
          currentCountdownSeconds: remainingTime,
          currentCycleCount,
          status,
          progress,
        })
        useFocusProgressingStore.getState().randomPhaseText()
      }
    })

    set({
      isInitializing: false,
    })
  },

  currentView: FocusView.setup,
  switchView: (view) => {
    set({
      currentView: view,
    })
    persistCurrentView(view)
  },
}))

export default useFocusUIStore
