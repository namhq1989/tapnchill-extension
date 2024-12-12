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
  resting = 'resting',
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
  focusSeconds: number
  breakSeconds: number
  numOfCycles: number

  currentCountdownSeconds: number
  currentCycleCount: number
  progress: number
  status: FocusStatus

  startSession: (
    focusSeconds: number,
    breakSeconds: number,
    numOfCycles: number,
  ) => void
  setRunning: () => void
  setResting: () => void

  setCurrentCountdownSeconds: (seconds: number) => void
  checkProgress: () => void
  stopSession: () => void
}
