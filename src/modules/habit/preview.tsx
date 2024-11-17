import { ListPlus } from 'lucide-react'
import { Link } from 'react-chrome-extension-router'
import HabitView from '@/modules/habit/view.tsx'
import { getTodayShortName } from '@/lib/date.ts'
import useHabitsStore from '@/modules/habit/store.ts'
import HabitPreviewItem from '@/modules/habit/habit-preview-item.tsx'

const HabitPreview = () => {
  const { habits, stats, completeHabit } = useHabitsStore()
  const todayStat = stats[0]

  return (
    <div className='flex flex-col w-full gap-2'>
      <div className='flex flex-row justify-between items-center'>
        <h2 className='text-base font-bold tracking-wide'>
          {getTodayShortName()} Activities{' '}
          {todayStat &&
            todayStat.scheduledCount > 0 &&
            `(${todayStat.completedCount}/${todayStat.scheduledCount})`}
        </h2>
        <div className='flex flex-row gap-4'>
          <Link component={HabitView}>
            <ListPlus className='cursor-pointer'></ListPlus>
          </Link>
        </div>
      </div>
      <div className='flex flex-col gap-2 items-start'>
        {habits.length === 0 && (
          <div className='flex flex-col w-full items-center justify-center py-4 mb-4'>
            <p className='text-sm text-muted-foreground'>
              Start building your best self today!
            </p>
          </div>
        )}
        {habits.map((habit) => (
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
