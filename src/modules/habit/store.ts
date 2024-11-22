import { create } from 'zustand'
import {
  HabitStatus,
  IChangeHabitStatusApiRequest,
  IChangeHabitStatusApiResponse,
  ICompleteHabitApiRequest,
  ICompleteHabitApiResponse,
  ICreateHabitApiRequest,
  ICreateHabitApiResponse,
  IGetHabitsApiResponse,
  IGetHabitsStatsApiRequest,
  IGetHabitsStatsApiResponse,
  IHabit,
  IHabitDailyStats,
  IHabitsStore,
  IUpdateHabitApiRequest,
  IUpdateHabitApiResponse,
} from '@/modules/habit/types.ts'
import listHabitIcons from '@/modules/habit/list-icons.ts'
import useHttpStore from '@/modules/http/store.ts'
import { mapHabits, mapStats } from '@/modules/habit/util.ts'
import useNotificationStore from '@/modules/notification/store.ts'
import { getRFC3339WithTimezone } from '@/lib/date.ts'
import { isYesterday } from 'date-fns/isYesterday'
import { isToday } from 'date-fns/isToday'
import { isBefore } from 'date-fns'

const useHabitsStore = create<IHabitsStore>((set, get) => ({
  icons: listHabitIcons,

  isFetchingHabits: false,
  habitsHasFetched: false,
  habits: [],

  isFetchingStats: false,
  statsHasFetched: false,
  stats: [],

  fetchHabits: async () => {
    const { habitsHasFetched } = get()
    if (habitsHasFetched) return

    try {
      set({ isFetchingHabits: true })

      const { get: httpGet } = useHttpStore.getState()
      const response = await httpGet<IGetHabitsApiResponse>('api/habit')
      set({ isFetchingHabits: false })

      set({ habits: mapHabits(response.habits), habitsHasFetched: true })
    } catch (err) {
      console.log('err', err)
    }
  },

  fetchStats: async () => {
    const { statsHasFetched } = get()
    if (statsHasFetched) return

    try {
      set({ isFetchingStats: true })

      const { get: httpGet } = useHttpStore.getState()
      const response = await httpGet<IGetHabitsStatsApiResponse>(
        'api/habit/stat',
        {
          date: getRFC3339WithTimezone(new Date()),
        } as IGetHabitsStatsApiRequest,
      )
      set({ isFetchingStats: false })

      set({ stats: mapStats(response.stats), statsHasFetched: true })
    } catch (err) {
      console.log('err', err)
    }
  },

  createHabit: async (
    name: string,
    goal: string,
    daysOfWeek: number[],
    icon: string,
    sortOrder: number,
  ) => {
    const { post: httpPost } = useHttpStore.getState()
    const { showNotification, showErrorNotification } =
      useNotificationStore.getState()

    try {
      const response = await httpPost<ICreateHabitApiResponse>('api/habit', {
        date: getRFC3339WithTimezone(new Date()),
        name,
        goal,
        daysOfWeek,
        icon,
        sortOrder,
      } as ICreateHabitApiRequest)

      showNotification({
        description: 'Activity created successfully',
      })

      const newHabit: IHabit = {
        id: response.id,
        name,
        goal,
        daysOfWeek,
        icon,
        sortOrder,
        status: HabitStatus.active,
        statsLongestStreak: 0,
        statsCurrentStreak: 0,
        statsTotalCompletions: 0,
        createdAt: new Date(),
        lastCompletedAt: null,
        lastActivatedAt: new Date(),
      }

      const { habits } = get()
      habits.unshift(newHabit)
      set({ habits })

      return true
    } catch (err) {
      showErrorNotification({
        description: `Something went wrong. Please try again (${err})`,
      })

      return false
    }
  },

  updateHabit: async (habit: IHabit) => {
    const { put: httpPut } = useHttpStore.getState()
    const { showNotification, showErrorNotification } =
      useNotificationStore.getState()

    try {
      await httpPut<IUpdateHabitApiResponse>(`api/habit/${habit.id}`, {
        date: getRFC3339WithTimezone(new Date()),
        name: habit.name,
        goal: habit.goal,
        daysOfWeek: habit.daysOfWeek,
        icon: habit.icon,
        sortOrder: habit.sortOrder,
      } as IUpdateHabitApiRequest)

      showNotification({
        description: 'Activity updated successfully',
      })

      const { habits } = get()
      set({
        habits: habits.map((h) => (h.id === habit.id ? habit : h)),
      })

      return true
    } catch (err) {
      showErrorNotification({
        description: `Something went wrong. Please try again (${err})`,
      })

      return false
    }
  },

  changeHabitStatus: async (id: string, status: HabitStatus) => {
    const { patch: httpPatch } = useHttpStore.getState()
    const { showErrorNotification } = useNotificationStore.getState()

    try {
      await httpPatch<IChangeHabitStatusApiResponse>(`api/habit/${id}/status`, {
        date: getRFC3339WithTimezone(new Date()),
        status,
      } as IChangeHabitStatusApiRequest)

      const { habits } = get()
      set({
        habits: habits.map((h) => {
          if (h.id === id) {
            h.status = status
            h.lastActivatedAt = new Date()
          }
          return h
        }),
      })
    } catch (err) {
      showErrorNotification({
        description: `Something went wrong. Please try again (${err})`,
      })
    }
  },

  completeHabit: async (id: string, date: Date) => {
    const { post: httpPost } = useHttpStore.getState()
    const { showNotification, showErrorNotification } =
      useNotificationStore.getState()

    try {
      await httpPost<ICompleteHabitApiResponse>(`api/habit/${id}/complete`, {
        date: getRFC3339WithTimezone(date),
      } as ICompleteHabitApiRequest)

      showNotification({
        description: getRandomMotivationalMessage(),
      })

      set({
        statsHasFetched: false,
      })
      const { fetchStats } = get()
      await fetchStats()

      const { habits } = get()
      const habit = habits.find((h) => h.id === id)
      if (habit) {
        habit.statsTotalCompletions++

        if (isToday(date)) {
          if (!habit.lastCompletedAt || isYesterday(habit.lastCompletedAt)) {
            habit.statsCurrentStreak++
          } else {
            habit.statsCurrentStreak = 1
          }
        }

        if (!habit.lastCompletedAt || isBefore(habit.lastCompletedAt, date)) {
          habit.lastCompletedAt = date
        }

        if (habit.statsCurrentStreak > habit.statsLongestStreak) {
          habit.statsLongestStreak = habit.statsCurrentStreak
        }

        set({
          habits: habits.map((h) => (h.id === id ? habit : h)),
        })
      }
    } catch (err) {
      showErrorNotification({
        description: `Something went wrong. Please try again (${err})`,
      })
    }
  },

  createDefaultDailyStats: (date: Date): IHabitDailyStats => {
    return {
      id: date.toISOString(),
      date,
      isCompleted: false,
      scheduledIds: [],
      completedIds: [],
    }
  },
}))

const motivationalMessages = [
  '✨ Great job! Keep going!',
  '💎 Small win, big progress!',
  '🌟 You’re building success!',
  '🔑 One habit closer to your goal!',
  '🏆 Habit crushed! On to the next!',
  '🔥 You’re unstoppable!',
  '💪 Consistency wins!',
  '🚀 Progress unlocked!',
  '🎉 Win logged for today!',
  '📅 Day complete, well done!',
]

const getRandomMotivationalMessage = (): string => {
  const randomIndex = Math.floor(Math.random() * motivationalMessages.length)
  return motivationalMessages[randomIndex]
}

export default useHabitsStore
