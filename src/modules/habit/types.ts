export interface IHabit {
  id: string
  name: string
  goal: string
  daysOfWeek: number[]
  icon: string
  sortOrder: number
  status: string
  statsLongestStreak: number
  statsCurrentStreak: number
  statsTotalCompletions: number
  createdAt: Date
  lastCompletedAt: Date | null
  lastActivatedAt: Date
}

export enum HabitStatus {
  active = 'active',
  inactive = 'inactive',
}

export interface IHabitDailyStats {
  id: string
  date: Date
  scheduledCount: number
  completedCount: number
  completedIds: string[]
}

export interface IHabitIcon {
  id: string
  url: string
}

export interface IHabitsStore {
  icons: IHabitIcon[]

  isFetchingHabits: boolean
  habitsHasFetched: boolean
  habits: IHabit[]

  isFetchingStats: boolean
  statsHasFetched: boolean
  stats: IHabitDailyStats[]

  fetchHabits: () => Promise<void>
  fetchStats: () => Promise<void>

  createHabit: (
    name: string,
    goal: string,
    daysOfWeek: number[],
    icon: string,
    sortOrder: number,
  ) => Promise<boolean>
  updateHabit: (habit: IHabit) => Promise<boolean>
  changeHabitStatus: (id: string, status: HabitStatus) => Promise<void>
  completeHabit: (id: string, date: Date) => Promise<void>

  createDefaultDailyStats: (date: Date) => IHabitDailyStats
}

export interface IHabitApiData {
  id: string
  name: string
  goal: string
  daysOfWeek: number[]
  icon: string
  sortOrder: number
  status: string
  statsLongestStreak: number
  statsCurrentStreak: number
  statsTotalCompletions: number
  createdAt: string
  lastCompletedAt: string
  lastActivatedAt: string
}

export interface IHabitDailyStatsApiData {
  id: string
  date: string
  scheduledCount: number
  completedCount: number
  completedIds: string[]
}

export interface IGetHabitsApiResponse {
  habits: IHabitApiData[]
}

export interface IGetHabitsStatsApiRequest {
  date: string
}

export interface IGetHabitsStatsApiResponse {
  stats: IHabitDailyStatsApiData[]
}

export interface ICreateHabitApiRequest {
  date: string
  name: string
  goal: string
  daysOfWeek: number[]
  icon: string
  sortOrder: number
}

export interface ICreateHabitApiResponse {
  id: string
}

export interface IUpdateHabitApiRequest {
  date: string
  name: string
  goal: string
  daysOfWeek: number[]
  icon: string
  sortOrder: number
}

export interface IUpdateHabitApiResponse {
  id: string
}

export interface IChangeHabitStatusApiRequest {
  date: string
  status: string
}

export interface IChangeHabitStatusApiResponse {
  id: string
}

export interface ICompleteHabitApiRequest {
  date: string
}

export interface ICompleteHabitApiResponse {
  id: string
}
