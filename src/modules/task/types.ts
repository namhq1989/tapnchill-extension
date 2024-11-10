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

export enum TaskStatus {
  todo = 'todo',
  done = 'done',
}

export interface ITask {
  id: string
  goalId: string
  goal: IGoal | null
  name: string
  description: string
  status: TaskStatus
  createdAt: Date
  dueDate: Date | null
  completedAt: Date | null
}

export interface ITaskStatusFilter {
  id: string
  name: string
}

export interface ITasksStore {
  goals: IGoal[]
  tasks: ITask[]

  initTasks: () => Promise<void>

  createTask: (
    name: string,
    description: string,
    dueDate: Date | null,
    goalId: string,
  ) => Promise<boolean>
  updateTask: (
    id: string,
    name: string,
    description: string,
    dueDate: Date | null,
  ) => Promise<boolean>
  toggleTask: (id: string) => void

  statusFilters: ITaskStatusFilter[]
  selectedStatusFilterId: string
  selectStatusFilter: (id: string) => void
}

export interface IGetGoalsApiRequest {
  keyword: string
  pageToken: string
}

export interface IGetGoalsApiResponse {
  goals: IGoal[]
  nextPageToken: string
}

export interface IGetTasksApiRequest {
  status: string
  goalId: string
  keyword: string
  pageToken: string
  limit: number
}

export interface IGetTasksApiResponse {
  tasks: ITask[]
  nextPageToken: string
}

export interface ICreateTaskApiRequest {
  name: string
  description: string
  dueDate: Date | null
  goalId: string
}

export interface ICreateTaskApiResponse {
  id: string
}

export interface IUpdateTaskApiRequest {
  id: string
  name: string
  description: string
  dueDate: Date | null
}

export interface IUpdateTaskApiResponse {
  id: string
}
