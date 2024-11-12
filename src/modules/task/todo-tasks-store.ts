import { create } from 'zustand/index'
import {
  IGetTasksApiRequest,
  IGetTasksApiResponse,
  ITodoTasksStore,
  TaskStatus,
} from '@/modules/task/types.ts'
import useHttpStore from '@/modules/http/store.ts'
import useGoalsStore from '@/modules/task/goals-store.ts'
import { mapTasks } from '@/modules/task/util.ts'

const useTodoTasksStore = create<ITodoTasksStore>((set) => ({
  tasks: [],
  isFetching: false,
  fetchTasks: async () => {
    try {
      set({ isFetching: true })

      const { get: httpGet } = useHttpStore.getState()
      const response = await httpGet<IGetTasksApiResponse>('api/task', {
        limit: 5,
        status: TaskStatus.todo,
      } as IGetTasksApiRequest)
      set({ isFetching: false })

      const { goals } = useGoalsStore.getState()
      if (response.tasks && response.tasks.length) {
        set({
          tasks: mapTasks(response.tasks, goals),
        })
      }
    } catch (err) {
      console.log('err', err)
    }
  },
}))

export default useTodoTasksStore
