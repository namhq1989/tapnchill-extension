import { create } from 'zustand/index'
import {
  IGetTasksApiRequest,
  IGetTasksApiResponse,
  ITodoTasksStore,
  TaskStatus,
} from '@/modules/task/types.ts'
import useHttpStore from '@/modules/http/store.ts'
import { mapTasks } from '@/modules/task/util.ts'
import useGoalsStore from '@/modules/goal/store.ts'

const useTodoTasksStore = create<ITodoTasksStore>((set, get) => ({
  hasFetched: false,
  tasks: [],
  isFetching: false,
  fetchTasks: async () => {
    const { hasFetched } = get()
    if (hasFetched) return

    try {
      set({ isFetching: true })

      const { get: httpGet } = useHttpStore.getState()
      const response = await httpGet<IGetTasksApiResponse>('api/task', {
        limit: 5,
        status: TaskStatus.todo,
      } as IGetTasksApiRequest)
      set({ isFetching: false })

      const { goals } = useGoalsStore.getState()
      set({
        tasks:
          response.tasks && response.tasks.length
            ? mapTasks(response.tasks, goals)
            : [],
        hasFetched: true,
      })
    } catch (err) {
      console.log('err', err)
    }
  },
}))

export default useTodoTasksStore
