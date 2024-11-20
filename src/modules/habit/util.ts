import {
  IHabit,
  IHabitApiData,
  IHabitDailyStats,
  IHabitDailyStatsApiData,
} from '@/modules/habit/types.ts'

const mapHabits = (habits: IHabitApiData[]): IHabit[] => {
  const result: IHabit[] = []
  for (const habit of habits) {
    result.push({
      id: habit.id,
      name: habit.name,
      goal: habit.goal,
      daysOfWeek: habit.daysOfWeek,
      icon: habit.icon,
      sortOrder: habit.sortOrder,
      status: habit.status,
      statsLongestStreak: habit.statsLongestStreak,
      statsCurrentStreak: habit.statsCurrentStreak,
      statsTotalCompletions: habit.statsTotalCompletions,
      createdAt: new Date(habit.createdAt),
      lastCompletedAt: habit.lastCompletedAt
        ? new Date(habit.lastCompletedAt)
        : null,
      lastActivatedAt: new Date(habit.lastActivatedAt),
    })
  }
  return result
}

const mapStats = (stats: IHabitDailyStatsApiData[]): IHabitDailyStats[] => {
  const result: IHabitDailyStats[] = []
  for (const stat of stats) {
    result.push({
      id: stat.id,
      date: new Date(stat.date),
      scheduledCount: stat.scheduledCount,
      completedCount: stat.completedCount,
      completedIds: stat.completedIds,
    })
  }
  return result
}

export { mapHabits, mapStats }
