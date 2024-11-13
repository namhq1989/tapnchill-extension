import { create } from 'zustand'
import { IHabitsStore } from '@/modules/habit/types.ts'
import listHabitIcons from '@/modules/habit/list-icons.ts'

const useHabitsStore = create<IHabitsStore>(() => ({
  icons: listHabitIcons,
}))

export default useHabitsStore
