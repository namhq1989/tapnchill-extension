import { create } from 'zustand'
import {
  ICreateTaskApiRequest,
  ICreateTaskApiResponse,
  IGetGoalsApiResponse,
  IGetTasksApiRequest,
  IGetTasksApiResponse,
  IGoal,
  ITask,
  ITasksStore,
  IUpdateTaskApiRequest,
  TaskStatus,
} from '@/modules/task/types.ts'
import useHttpStore from '@/modules/http/store.ts'
import useNotificationStore from '@/modules/notification/store.ts'

const TASK_API_SYNC_INTERVAL = 1800000 // 30 minutes

const useTaskStore = create<ITasksStore>((set, get) => ({
  goals: [],
  tasks: [],
  initTasks: async () => {
    chrome.storage.local.get(async (result) => {
      const tasks = result.tasks || undefined
      const goals = result.goals || undefined
      const tasksLastSyncedTs = result.tasksLastSynced || 0

      const nowTs = new Date().getTime()

      if (
        tasks !== undefined &&
        nowTs - tasksLastSyncedTs < TASK_API_SYNC_INTERVAL
      ) {
        set({ tasks, goals: goals || [] })
        return
      }

      const { get: httpGet } = useHttpStore.getState()
      const goalResponse = await httpGet<IGetGoalsApiResponse>(
        'api/task/goal',
        {},
      )
      if (goalResponse && goalResponse.goals && goalResponse.goals.length) {
        set({
          goals: goalResponse.goals,
        })
      }

      const taskResponse = await httpGet<IGetTasksApiResponse>('api/task', {
        limit: 5,
      } as IGetTasksApiRequest)
      if (taskResponse && taskResponse.tasks && taskResponse.tasks.length) {
        set({
          tasks: mapTasks(taskResponse, goalResponse.goals || []),
        })
      }
    })
  },
  createTask: async (name, description, dueDate, goalId): Promise<boolean> => {
    const { post: httpPost } = useHttpStore.getState()
    const { showNotification, showErrorNotification } =
      useNotificationStore.getState()

    try {
      const response = await httpPost<ICreateTaskApiResponse>('api/task', {
        name,
        description,
        dueDate,
        goalId,
      } as ICreateTaskApiRequest)

      showNotification({
        description: 'Task created successfully',
      })

      // update task in store
      const { tasks, goals } = get()
      const goal = goals.find((g) => g.id === goalId)

      tasks.unshift({
        id: response.id,
        goalId,
        goal: goal || null,
        name,
        description,
        status: TaskStatus.todo,
        createdAt: new Date(),
        dueDate,
        completedAt: null,
      })
      set({ tasks })

      return true
    } catch (err) {
      showErrorNotification({
        description: `Something went wrong. Please try again (${err})`,
      })
      return false
    }
  },
  updateTask: async (id, name, description, dueDate): Promise<boolean> => {
    const { put: httpPut } = useHttpStore.getState()
    const { showNotification, showErrorNotification } =
      useNotificationStore.getState()

    try {
      await httpPut<ICreateTaskApiResponse>(`api/task/${id}`, {
        name,
        description,
        dueDate,
      } as IUpdateTaskApiRequest)

      showNotification({
        description: 'Task updated successfully',
      })

      // update task in store
      const { tasks } = get()
      set({
        tasks: tasks.map((t) =>
          t.id === id
            ? {
                ...t,
                name,
                description,
                dueDate,
              }
            : t,
        ),
      })

      return true
    } catch (err) {
      showErrorNotification({
        description: `Something went wrong. Please try again (${err})`,
      })

      return false
    }
  },
  toggleTask: (id: string) => {
    const { tasks } = get()
    const task = tasks.find((t) => t.id === id)
    if (!task) return

    let newStatus = TaskStatus.todo
    if (task.status === TaskStatus.todo) {
      newStatus = TaskStatus.done
    }

    task.status = newStatus
    if (task.status === TaskStatus.done) {
      task.completedAt = new Date()
    }
    set({
      tasks: tasks.map((t) => (t.id === id ? task : t)),
    })
  },

  statusFilters: [
    { id: 'all', name: 'All' },
    { id: 'todo', name: 'Todo' },
    { id: 'done', name: 'Done' },
  ],
  selectedStatusFilterId: '',
  selectStatusFilter: (id: string) => {
    const { selectedStatusFilterId } = get()
    if (selectedStatusFilterId === id) return

    set({ selectedStatusFilterId: id })
    chrome.storage.local
      .set({
        taskSelectedStatusFilterId: id,
      })
      .then()
  },
}))

const mapTasks = (tasks: IGetTasksApiResponse, goals: IGoal[]): ITask[] => {
  const result: ITask[] = []
  for (const task of tasks.tasks) {
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

export default useTaskStore
