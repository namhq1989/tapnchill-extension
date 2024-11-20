import { HabitStatus, IHabit, IHabitDailyStats } from '@/modules/habit/types.ts'
import { Badge } from '@/components/ui/badge.tsx'
import { isSameDay } from 'date-fns'

interface IHabitPreviewItemProps {
  habit: IHabit
  stats: IHabitDailyStats
  onComplete: () => void
}

const HabitPreviewItem = (props: IHabitPreviewItemProps) => {
  const { habit, stats, onComplete } = props
  const isCompleted = stats.completedIds.includes(habit.id)

  // don't show habit if it was created today, or activated today
  if (
    isSameDay(habit.createdAt, new Date()) ||
    isSameDay(habit.lastActivatedAt, new Date())
  ) {
    return null
  }

  // don't show habit if it is inactive
  if (!isCompleted && habit.status === HabitStatus.inactive) {
    return
  }

  return (
    <div className='flex flex-row w-full gap-2 rounded-xl container-selected p-4 items-center'>
      <img
        src={`${import.meta.env.VITE_CDN_ENDPOINT}/${habit.icon}.png`}
        alt={habit.icon}
        width={40}
        height={40}
      />
      <div className='flex flex-col flex-grow gap-1'>
        <p className='text-sm font-medium leading-tight'>{habit.name}</p>
        <p className='text-xs text-muted-foreground'>{habit.goal}</p>
      </div>
      {isCompleted ? (
        <Badge>Checked</Badge>
      ) : (
        <Badge
          variant='outline'
          className='cursor-pointer ring-1 text-muted-foreground ring-muted-foreground'
          onClick={() => onComplete()}
        >
          Check
        </Badge>
      )}
    </div>
  )
}

export default HabitPreviewItem
