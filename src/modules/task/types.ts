export interface IGoal {
  id: string
  name: string
  description: string
  isCompleted: boolean
  createdAt: Date
}

export interface ITask {
  id: string
  goalId: string
  name: string
  description: string
  isCompleted: boolean
  createdAt: Date
  dueDate: Date | null
  completedAt: Date | null
}

export interface ITasksStore {
  goals: IGoal[]
  tasks: ITask[]
  toggleTask: (id: string) => void
}
