export interface IBlockedSite {
  hostname: string
  addedAt: string
}

export enum FocusView {
  setup = 'setup',
  progressing = 'progressing',
}

export enum FocusStatus {
  running = 'running',
  paused = 'paused',
}

export interface IFocusUIStore {
  isInitializing: boolean
  initFocus: () => void
  currentView: FocusView
  switchView: (view: FocusView) => void
}

export interface IFocusSetupStore {
  maxBlockedSites: number
  setMaxBlockedSites: (value: number) => void
  focusTime: number
  breakTime: number
  numOfCycles: number
  setFocusTime: (min: number) => void
  setBreakTime: (min: number) => void
  setNumOfCycles: (num: number) => void
  blockedSites: IBlockedSite[]
  addBlockedSite: (site: string) => void
  removeBlockedSite: (site: string) => void
  startFocus: () => void
  setUserPlan: (plan: string) => void
}

export interface IFocusProgressingStore {
  initialCountdown: number
  setInitialCountdown: (value: number) => void
  countdown: number
  currentCycle: number
  status: FocusStatus
  progress: number
  setCountdown: (value: number) => void
  toggleRunning: () => void
  resetProgress: () => void
  checkProgress: () => void
  stopFocus: () => void
}
