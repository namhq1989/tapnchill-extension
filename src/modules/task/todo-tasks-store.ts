import { create } from 'zustand/index'
import {
  IGetTasksApiRequest,
  IGetTasksApiResponse,
  ITask,
  ITodoTasksStore,
  TaskStatus,
} from '@/modules/task/types.ts'
import useHttpStore from '@/modules/http/store.ts'
import useGoalsStore from '@/modules/task/goals-store.ts'
import { mapTasks } from '@/modules/task/util.ts'

const TODO_TASKS_API_SYNC_INTERVAL = 1800000 // 30 minutes

const useTodoTasksStore = create<ITodoTasksStore>((set) => ({
  tasks: [],
  fetchTasks: async () => {
    chrome.storage.local.get(async (result) => {
      const todoTasksStr = result.todoTasks || undefined
      const todoTasksLastSyncedTs = result.todoTasksLastSyncedTs || 0
      const nowTs = new Date().getTime()
      const { goals } = useGoalsStore.getState()

      if (
        todoTasksStr !== undefined &&
        nowTs - todoTasksLastSyncedTs < TODO_TASKS_API_SYNC_INTERVAL
      ) {
        const tasks = JSON.parse(todoTasksStr) as ITask[]
        set({
          tasks: mapTasks(tasks, goals),
        })
        return
      }

      const { get: httpGet } = useHttpStore.getState()
      const response = await httpGet<IGetTasksApiResponse>('api/task', {
        limit: 5,
        status: TaskStatus.todo,
      } as IGetTasksApiRequest)
      if (response && response.tasks && response.tasks.length) {
        set({
          tasks: mapTasks(response.tasks, goals),
        })
        chrome.storage.local
          .set({
            todoTasks: JSON.stringify(response.tasks),
            todoTasksLastSyncedTs: new Date().getTime(),
          })
          .then()
      } else {
        chrome.storage.local
          .set({
            todoTasks: undefined,
            todoTasksLastSyncedTs: 0,
          })
          .then()
      }
    })
  },
}))

export default useTodoTasksStore
