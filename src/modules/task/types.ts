export interface IGoal {
  id: string
  name: string
  description: string
  isCompleted: boolean
  createdAt: Date
}

export enum TaskStatus {
  todo = 'todo',
  done = 'done',
}

export interface ITask {
  id: string
  goalId: string
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
  toggleTask: (id: string) => void

  statusFilters: ITaskStatusFilter[]
  selectedStatusFilterId: string
  selectStatusFilter: (id: string) => void
}
