import { create } from 'zustand/index'
import {
  IGetTasksApiRequest,
  IGetTasksApiResponse,
  IListTasksStore,
  TaskStatus,
} from '@/modules/task/types.ts'
import useHttpStore from '@/modules/http/store.ts'
import { mapTasks } from '@/modules/task/util.ts'
import useGoalsStore from '@/modules/task/goals-store.ts'

const useListTasksStore = create<IListTasksStore>((set, get) => ({
  hasFetched: false,
  init: async () => {
    const { hasFetched, fetchTasks } = get()
    if (!hasFetched) {
      await fetchTasks()
      set({ hasFetched: true })
    }
  },
  tasks: [],
  isFetching: false,
  fetchTasks: async () => {
    const { tasks, selectedStatusFilterId, nextPageToken } = get()
    const { get: httpGet } = useHttpStore.getState()

    set({ isFetching: true })

    try {
      const response = await httpGet<IGetTasksApiResponse>('api/task', {
        limit: 20,
        status:
          selectedStatusFilterId === 'all' ? undefined : selectedStatusFilterId,
        pageToken: nextPageToken,
      } as IGetTasksApiRequest)
      set({ isFetching: false })

      const { goals } = useGoalsStore.getState()
      const newTasks = [...tasks, ...mapTasks(response.tasks, goals)]
      set({
        tasks: newTasks,
        nextPageToken: response.nextPageToken,
      })
    } catch (err) {
      console.log('err', err)
    }
  },

  statusFilters: [
    { id: 'all', name: 'All' },
    { id: TaskStatus.todo, name: 'Todo' },
    { id: TaskStatus.done, name: 'Done' },
  ],
  selectedStatusFilterId: 'all',
  selectStatusFilter: async (id: string) => {
    const { selectedStatusFilterId } = get()
    if (selectedStatusFilterId === id) return

    set({ selectedStatusFilterId: id, tasks: [], nextPageToken: '' })
    const { fetchTasks } = get()
    await fetchTasks()
  },

  nextPageToken: '',
}))

export default useListTasksStore
