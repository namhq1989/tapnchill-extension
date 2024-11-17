import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet.tsx'
import { useState } from 'react'
import useHabitsStore from '@/modules/habit/store.ts'
import { format, isBefore, isSameDay } from 'date-fns'
import HabitPreviewItem from '@/modules/habit/habit-preview-item.tsx'
import { getDateNameFirstLetter } from '@/lib/date.ts'

const side = 'bottom'

interface IDailyActivitiesViewProps {
  date: Date
  styles: string
}

const DailyActivitiesView = (props: IDailyActivitiesViewProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { habits, stats, completeHabit, createDefaultDailyStats } =
    useHabitsStore()

  const { date, styles } = props
  let isAfter = false
  let dateStats = stats.find((s) => isSameDay(s.date, date))
  if (!dateStats) {
    isAfter = true
    dateStats = createDefaultDailyStats(date)
  }

  // filter habits
  const filteredHabits = habits.filter((habit) => {
    if (dateStats.completedIds.includes(habit.id)) {
      return habit
    }

    if (
      habit.daysOfWeek.includes(date.getDay()) &&
      isBefore(habit.createdAt, date)
    ) {
      return habit
    }

    return null
  })

  return (
    <div className='flex w-full cursor-pointer'>
      <Sheet key={side} open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <div
            key={`stats-summary-${date.getDay()}`}
            className='flex flex-col gap-1 w-full cursor-pointer'
          >
            <p className='self-center'>{getDateNameFirstLetter(date)}</p>
            <div
              className={`flex aspect-square rounded-full items-center justify-center ${styles}`}
            >
              {format(date, 'dd')}
            </div>
          </div>
        </SheetTrigger>
        {isOpen && !isAfter && (
          <SheetContent
            side={side}
            className='w-full min-h-[250px] max-h-[90%] overflow-auto p-0 rounded-tl-xl rounded-tr-xl'
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <SheetHeader className='p-4'>
              <SheetTitle>
                <p className='text-base text-primary font-bold tracking-wide'>
                  {format(date, 'dd/MM')}
                </p>
              </SheetTitle>
            </SheetHeader>
            <div className='flex flex-col gap-2 p-4'>
              {filteredHabits.length > 0 && (
                <div className='flex flex-col gap-2 mb-4 px-4'>
                  <div className='flex flex-row justify-between items-center'>
                    <p className='text-sm'>Total activities</p>
                    <p className='text-sm font-bold'>
                      {dateStats.scheduledCount}
                    </p>
                  </div>
                  <div className='flex flex-row justify-between items-center'>
                    <p className='text-sm'>Completed activities</p>
                    <p className='text-sm font-bold'>
                      {dateStats.completedCount}
                    </p>
                  </div>
                </div>
              )}
              {filteredHabits.length === 0 && (
                <div className='flex flex-col w-full items-center justify-center py-4 mb-4'>
                  <p className='text-sm text-muted-foreground'>
                    You don't have any activities for this day!
                  </p>
                </div>
              )}
              {filteredHabits.map((habit) => (
                <HabitPreviewItem
                  key={habit.id}
                  habit={habit}
                  stats={dateStats}
                  onComplete={async () => {
                    await completeHabit(habit.id, date)
                  }}
                />
              ))}
            </div>
          </SheetContent>
        )}
      </Sheet>
    </div>
  )
}

export default DailyActivitiesView
