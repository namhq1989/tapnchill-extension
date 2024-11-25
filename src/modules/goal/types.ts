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
  totalDoneTask: number
}

export interface IGoalsStore {
  hasFetched: boolean
  goals: IGoal[]
  fetchGoals: () => Promise<void>
  createGoal: (name: string, description: string) => Promise<boolean>
  updateGoal: (goal: IGoal) => Promise<boolean>
  deleteGoal: (goal: IGoal) => Promise<boolean>
}

export interface IGetGoalsApiRequest {
  keyword: string
  pageToken: string
}

export interface IGetGoalsApiResponse {
  goals: IGoal[]
  nextPageToken: string
}

export interface ICreateGoalApiRequest {
  name: string
  description: string
}

export interface ICreateGoalApiResponse {
  id: string
}

export interface IUpdateGoalApiRequest {
  name: string
  description: string
}

export interface IUpdateGoalApiResponse {
  id: string
}
