import { ITask } from '@/modules/task/types.ts'
import { IGoal } from '@/modules/goal/types.ts'

const mapTasks = (tasks: ITask[], goals: IGoal[]): ITask[] => {
  const result: ITask[] = []
  for (const task of tasks) {
    const goal = goals.find((g) => g.id === task.goalId)

    result.push({
      id: task.id,
      goalId: task.goalId,
      goal: goal || null,
      name: task.name,
      description: task.description,
      status: task.status,
      createdAt: new Date(task.createdAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : null,
      completedAt: task.completedAt ? new Date(task.completedAt) : null,
    })
  }
  return result
}

export { mapTasks }
