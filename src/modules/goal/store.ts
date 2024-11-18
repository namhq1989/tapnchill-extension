import { create } from 'zustand/index'
import {
  ICreateGoalApiRequest,
  ICreateGoalApiResponse,
  IGetGoalsApiResponse,
  IGoal,
  IGoalsStore,
  IUpdateGoalApiRequest,
  IUpdateGoalApiResponse,
} from '@/modules/goal/types.ts'
import useHttpStore from '@/modules/http/store.ts'
import useNotificationStore from '@/modules/notification/store.ts'

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

  createGoal: async (name: string, description: string) => {
    const { post: httpPost } = useHttpStore.getState()
    const { showNotification, showErrorNotification } =
      useNotificationStore.getState()

    try {
      const response = await httpPost<ICreateGoalApiResponse>('api/task/goal', {
        name,
        description,
      } as ICreateGoalApiRequest)

      showNotification({
        description: 'Goal created successfully',
      })

      const newGoal: IGoal = {
        id: response.id,
        name,
        description,
        createdAt: new Date(),
        isCompleted: false,
        stats: {
          totalTask: 0,
          totalDoneTask: 0,
        },
      }

      const { goals } = get()
      goals.unshift(newGoal)
      set({ goals })

      return true
    } catch (err) {
      showErrorNotification({
        description: `Something went wrong. Please try again (${err})`,
      })

      return false
    }
  },

  updateGoal: async (goal: IGoal) => {
    const { put: httpPut } = useHttpStore.getState()
    const { showNotification, showErrorNotification } =
      useNotificationStore.getState()

    try {
      await httpPut<IUpdateGoalApiResponse>(`api/task/goal/${goal.id}`, {
        name: goal.name,
        description: goal.description,
      } as IUpdateGoalApiRequest)

      showNotification({
        description: 'Goal updated successfully',
      })

      const { goals } = get()
      set({
        goals: goals.map((g) => (g.id === goal.id ? goal : g)),
      })

      return true
    } catch (err) {
      showErrorNotification({
        description: `Something went wrong. Please try again (${err})`,
      })

      return false
    }
  },
}))

export default useGoalsStore
