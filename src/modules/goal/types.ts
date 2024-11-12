export interface IGoal {
  id: string
  name: string
  description: string
  stats: IGoalStats
  isCompleted: boolean
  createdAt: Date
}

export interface IGoalStats {
  totalTask: number
  totalCompletedTask: number
}

export interface IGoalsStore {
  hasFetched: boolean
  goals: IGoal[]
  fetchGoals: () => Promise<void>
}

export interface IGetGoalsApiRequest {
  keyword: string
  pageToken: string
}

export interface IGetGoalsApiResponse {
  goals: IGoal[]
  nextPageToken: string
}
