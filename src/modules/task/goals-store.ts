import { create } from 'zustand/index'
import {
  IGetGoalsApiResponse,
  IGoal,
  IGoalsStore,
} from '@/modules/task/types.ts'
import useHttpStore from '@/modules/http/store.ts'

const GOALS_API_SYNC_INTERVAL = 43200000 // 12 hours

const useGoalsStore = create<IGoalsStore>((set) => ({
  goals: [],
  fetchGoals: async () => {
    chrome.storage.local.get(async (result) => {
      const goalsStr = result.goals || undefined
      const goalsLastSyncedTs = result.goalsLastSyncedTs || 0
      const nowTs = new Date().getTime()

      if (
        goalsStr !== undefined &&
        nowTs - goalsLastSyncedTs < GOALS_API_SYNC_INTERVAL
      ) {
        const goals = JSON.parse(goalsStr) as IGoal[]
        set({ goals })
        return
      }

      const { get: httpGet } = useHttpStore.getState()
      const response = await httpGet<IGetGoalsApiResponse>('api/task/goal', {})
      if (response && response.goals && response.goals.length) {
        set({ goals: response.goals })
        chrome.storage.local
          .set({
            goals: JSON.stringify(response.goals),
            goalsLastSyncedTs: nowTs,
          })
          .then()
      } else {
        set({ goals: [] })
        chrome.storage.local
          .set({ goals: undefined, goalsLastSyncedTs: 0 })
          .then()
      }
    })
  },
}))

export default useGoalsStore
