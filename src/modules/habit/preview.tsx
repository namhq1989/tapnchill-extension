import { ListPlus } from 'lucide-react'
import { Link } from 'react-chrome-extension-router'
import HabitView from '@/modules/habit/view.tsx'
import { getTodayShortName } from '@/lib/date.ts'
import useHabitsStore from '@/modules/habit/store.ts'
import HabitPreviewItem from '@/modules/habit/habit-preview-item.tsx'
import { isSameDay } from 'date-fns'

const HabitPreview = () => {
  const { habits, stats, completeHabit } = useHabitsStore()
  const todayStat = stats[0]
  const now = new Date()

  // filter habits
  const filteredHabits = habits.filter((habit) => {
    if (isSameDay(habit.createdAt, now)) {
      return null
    }

    return habit
  })

  return (
    <div className='flex flex-col w-full gap-2 p-4'>
      <div className='flex flex-row justify-between items-center'>
        <h2 className='text-base font-bold tracking-wide'>
          {getTodayShortName()} Activities{' '}
          {todayStat &&
            filteredHabits.length > 0 &&
            `(${todayStat.completedIds.length}/${filteredHabits.length})`}
        </h2>
        <div className='flex flex-row gap-4'>
          <Link component={HabitView}>
            <ListPlus className='cursor-pointer'></ListPlus>
          </Link>
        </div>
      </div>
      <div className='flex flex-col gap-2 items-start'>
        {filteredHabits.length === 0 && (
          <div className='flex flex-col w-full items-center justify-center py-4 mb-4'>
            <p className='text-sm text-muted-foreground'>
              Start building your best self today!
            </p>
          </div>
        )}
        {filteredHabits.map((habit) => (
          <HabitPreviewItem
            key={habit.id}
            habit={habit}
            stats={todayStat}
            onComplete={async () => {
              await completeHabit(habit.id, new Date())
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default HabitPreview
