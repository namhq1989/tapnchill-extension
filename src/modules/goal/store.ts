import { create } from 'zustand/index'
import { IGetGoalsApiResponse, IGoalsStore } from '@/modules/goal/types.ts'
import useHttpStore from '@/modules/http/store.ts'

const useGoalsStore = create<IGoalsStore>((set, get) => ({
  hasFetched: false,
  goals: [],
  fetchGoals: async () => {
    const { hasFetched } = get()
    if (hasFetched) return

    const { get: httpGet } = useHttpStore.getState()

    try {
      const response = await httpGet<IGetGoalsApiResponse>('api/task/goal', {})
      set({ goals: response.goals, hasFetched: true })
    } catch (err) {
      console.log('err', err)
    }
  },
}))

export default useGoalsStore
