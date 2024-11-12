import { IGoal } from '@/modules/goal/types.ts'

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

export interface ITodoTasksStore {
  hasFetched: boolean
  tasks: ITask[]
  fetchTasks: () => Promise<void>
  isFetching: boolean
}

export interface IListTasksStore {
  hasFetched: boolean
  init: () => Promise<void>
  tasks: ITask[]
  isFetching: boolean
  fetchTasks: () => Promise<void>

  statusFilters: ITaskStatusFilter[]
  selectedStatusFilterId: string
  selectStatusFilter: (id: string) => Promise<void>

  nextPageToken: string
}

export interface ITaskManipulationStore {
  createTask: (
    name: string,
    description: string,
    dueDate: Date | null,
    goalId: string,
  ) => Promise<boolean>
  updateTask: (task: ITask) => Promise<boolean>
  toggleTask: (task: ITask) => Promise<void>
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

export interface IChangeTaskStatusApiRequest {
  status: TaskStatus
}

export interface IChangeTaskStatusApiResponse {
  id: string
}
