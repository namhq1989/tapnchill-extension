import { create } from 'zustand/index'
import {
  IGetTasksApiRequest,
  IGetTasksApiResponse,
  IListTasksStore,
  ITask,
  TaskStatus,
} from '@/modules/task/types.ts'
import useHttpStore from '@/modules/http/store.ts'
import { mapTasks } from '@/modules/task/util.ts'
import useGoalsStore from '@/modules/task/goals-store.ts'

const LIST_TASKS_API_SYNC_INTERVAL = 1800000 // 30 minutes

const useListTasksStore = create<IListTasksStore>((set, get) => ({
  init: () => {
    chrome.storage.local.get(async (result) => {
      const listTaskSelectedStatusFilterId =
        result.listTaskSelectedStatusFilterId || 'all'
      const listTasksNextPageToken = result.listTasksNextPageToken || ''
      set({
        selectedStatusFilterId: listTaskSelectedStatusFilterId,
        nextPageToken: listTasksNextPageToken,
      })
    })
  },
  tasks: [],
  isFetching: false,
  fetchTasks: async () => {
    chrome.storage.local.get(async (result) => {
      const listTasksStr = result.listTasks || undefined
      const listTasksLastSyncedTs = result.listTasksLastSyncedTs || 0
      const nowTs = new Date().getTime()
      const { goals } = useGoalsStore.getState()

      if (
        listTasksStr !== undefined &&
        nowTs - listTasksLastSyncedTs < LIST_TASKS_API_SYNC_INTERVAL
      ) {
        const tasks = JSON.parse(listTasksStr) as ITask[]
        set({
          tasks: mapTasks(tasks, goals),
        })
        return
      }

      const { tasks, selectedStatusFilterId, nextPageToken } = get()
      const { get: httpGet } = useHttpStore.getState()
      const response = await httpGet<IGetTasksApiResponse>('api/task', {
        limit: 20,
        status:
          selectedStatusFilterId === 'all' ? undefined : selectedStatusFilterId,
        pageToken: nextPageToken,
      } as IGetTasksApiRequest)
      if (response && response.tasks && response.tasks.length) {
        const { goals } = useGoalsStore.getState()
        const newTasks = [...tasks, ...mapTasks(response.tasks, goals)]
        set({
          tasks: newTasks,
          nextPageToken: response.nextPageToken,
        })
        chrome.storage.local
          .set({
            listTasks: JSON.stringify(newTasks),
            listTasksLastSyncedTs: new Date().getTime(),
            listTasksNextPageToken: response.nextPageToken,
          })
          .then()
      } else {
        chrome.storage.local
          .set({
            listTasks: undefined,
            listTasksLastSyncedTs: 0,
            listTasksNextPageToken: '',
          })
          .then()
      }
    })
  },

  statusFilters: [
    { id: 'all', name: 'All' },
    { id: TaskStatus.todo, name: 'Todo' },
    { id: TaskStatus.done, name: 'Done' },
  ],
  selectedStatusFilterId: 'all',
  selectStatusFilter: (id: string) => {
    const { selectedStatusFilterId } = get()
    if (selectedStatusFilterId === id) return

    set({ selectedStatusFilterId: id })
    chrome.storage.local
      .set({
        listTaskSelectedStatusFilterId: id,
      })
      .then()
  },

  nextPageToken: '',
}))

export default useListTasksStore
