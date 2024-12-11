import { create } from 'zustand'
import {
  FocusStatus,
  FocusView,
  IBlockedSite,
  IFocusUIStore,
} from '@/modules/focus/types.ts'
import useFocusSetupStore from '@/modules/focus/setup-store.ts'
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
    console.log('Focus current view', result)
    callback(result.focusCurrentView || FocusView.setup)
  })
}

const getProgressStateFromStorage = (
  callback: (
    state: {
      initialCountdown: number
      countdown: number
      status: FocusStatus
      lastUpdated: number
      currentCycle: number
    } | null,
  ) => void,
) => {
  chrome.storage.local.get(['focusProgress'], (result) => {
    callback(result.focusProgress || null)
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

    getProgressStateFromStorage((savedState) => {
      if (savedState) {
        const {
          initialCountdown,
          countdown,
          status,
          lastUpdated,
          currentCycle,
        } = savedState

        let updatedCountdown = countdown

        if (status === FocusStatus.running) {
          const now = Date.now()
          const elapsed = Math.floor((now - lastUpdated) / 1000)

          updatedCountdown = countdown - elapsed
          if (updatedCountdown < 0) {
            updatedCountdown = 0
          }
        }

        const progress =
          ((initialCountdown - updatedCountdown) / initialCountdown) * 100

        useFocusProgressingStore.setState({
          initialCountdown,
          countdown: updatedCountdown,
          status,
          progress,
          currentCycle,
        })

        console.log('Loaded focus progressing from local storage')
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
