import { SubscriptionPlan } from '@/modules/common/types.ts'

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
  completed = 'completed',
}

export interface IFocusOverallMetrics {
  totalFocusTime: number
  totalRestTime: number
  totalCycles: number
  completedCycles: number
  totalSessions: number
  completedSessions: number
  longestFocusPhase: number
}

export interface IFocusDailyMetrics {
  date: string
  focusTime: number
  restTime: number
  cycles: number
  completedCycles: number
  sessions: number
  completedSessions: number
  longestFocusPhase: number
}

export interface IFocusUIStore {
  isInitializing: boolean
  initFocus: () => void
  currentView: FocusView
  switchView: (view: FocusView) => void
}

export interface IFocusMetricsStore {
  fetchOverallMetrics: () => Promise<IFocusOverallMetrics>
  fetchTodayMetrics: () => Promise<IFocusDailyMetrics>
  fetchLastNDaysMetrics: (days: number) => Promise<IFocusDailyMetrics[]>
}

export interface IFocusSetupStore {
  maxBlockedSites: number
  setMaxBlockedSites: (value: number) => void
  focusTime: number
  breakTime: number
  numOfCycles: number
  isPlaySoundOnResting: boolean
  setFocusTime: (min: number) => void
  setBreakTime: (min: number) => void
  setNumOfCycles: (num: number) => void
  setIsPlaySoundOnResting: (value: boolean) => void
  blockedSites: IBlockedSite[]
  addBlockedSite: (site: string) => void
  removeBlockedSite: (site: string) => void
  startFocus: () => void
  setUserPlan: (plan: SubscriptionPlan) => void
}

export interface IFocusProgressingStore {
  countdownSeconds: number
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
  setRunning: (
    countdownSeconds: number,
    currentCountdownSeconds: number,
    currentCycleCount: number,
  ) => void
  setResting: (
    countdownSeconds: number,
    currentCountdownSeconds: number,
    currentCycleCount: number,
  ) => void
  setCompleted: () => void

  setCurrentCountdownSeconds: (seconds: number) => void
  stopSession: () => void

  phaseText: string
  randomPhaseText: () => void
}
