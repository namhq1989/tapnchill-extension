import { create } from 'zustand'
import {
  FocusView,
  IBlockedSite,
  IFocusSetupStore,
} from '@/modules/focus/types.ts'
import { validateAndExtractHostname } from '@/lib/string.ts'
import useNotificationStore from '@/modules/notification/store.ts'
import useFocusUIStore from '@/modules/focus/ui-store.ts'
import useFocusProgressingStore from '@/modules/focus/progressing-store.ts'

const FREE_PLAN_BLOCKED_SITES = 5
const PRO_PLAN_BLOCKED_SITES = 50

export const MIN_FOCUS_TIME = 1
export const MAX_FOCUS_TIME = 300

const persistBlockedSites = (sites: IBlockedSite[]) => {
  chrome.storage.local.set({ blockedSites: sites }, () => {
    console.log('Blocked sites persisted to local storage:', sites)
  })
}

const useFocusSetupStore = create<IFocusSetupStore>((set, get) => ({
  setUserPlan: (plan) => {
    if (plan === 'pro') {
      set({ maxBlockedSites: PRO_PLAN_BLOCKED_SITES })
    } else {
      set({ maxBlockedSites: FREE_PLAN_BLOCKED_SITES })
    }
  },

  maxBlockedSites: FREE_PLAN_BLOCKED_SITES,
  setMaxBlockedSites: (value: number) => {
    if (value < 1) {
      return
    }

    set(() => ({
      maxBlockedSites: value,
    }))
  },

  focusTime: 25,
  blockedSites: [],

  setFocusTime: (min: number) => {
    const { showErrorNotification } = useNotificationStore.getState()

    if (min < MIN_FOCUS_TIME || min > MAX_FOCUS_TIME) {
      showErrorNotification({
        description: `Focus time must be between ${MIN_FOCUS_TIME} and ${MAX_FOCUS_TIME} minutes`,
      })
    }
    set(() => ({
      focusTime: min,
    }))

    useFocusProgressingStore.getState().setCountdown(min * 60 * 1000)
  },

  addBlockedSite: (site) => {
    const { showErrorNotification } = useNotificationStore.getState()

    site = validateAndExtractHostname(site) || ''
    if (!site) {
      showErrorNotification({
        description: 'Invalid website address',
      })
      return
    }

    const currentSites = get().blockedSites
    const maxSites = get().maxBlockedSites

    // check for duplicates
    if (currentSites.some((blockedSite) => blockedSite.hostname === site)) {
      showErrorNotification({
        description: 'This site is already in the block list',
      })
      return
    }

    // check if the maximum limit is reached
    if (currentSites.length >= maxSites) {
      showErrorNotification({
        description: `Free plan can block up to ${maxSites} sites. Upgrade to Pro for a higher limit!`,
      })
      return
    }

    const newSite: IBlockedSite = {
      hostname: site,
      addedAt: new Date().toISOString(),
    }

    const updatedSites = [...currentSites, newSite]
    set({ blockedSites: updatedSites })
    persistBlockedSites(updatedSites)
  },

  removeBlockedSite: (site) => {
    const currentSites = get().blockedSites
    const updatedSites = currentSites.filter(
      (blockedSite) => blockedSite.hostname !== site,
    )

    // Update the store and persist to local storage
    set({ blockedSites: updatedSites })
    persistBlockedSites(updatedSites)
  },

  // Start focus mode and switch to Progressing View
  startFocus: () => {
    const { switchView } = useFocusUIStore.getState()
    switchView(FocusView.progressing)

    const { focusTime } = get()
    const { setInitialCountdown } = useFocusProgressingStore.getState()
    setInitialCountdown(focusTime * 60)

    chrome.alarms
      .create('focusCountdown', {
        delayInMinutes: focusTime,
      })
      .then(() => {
        console.log(`Focus session alarm set for ${focusTime} minutes.`)
      })
  },
}))

export default useFocusSetupStore
