import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet.tsx'
import { useState } from 'react'
import useHabitsStore from '@/modules/habit/store.ts'
import { format, isAfter, isBefore, isSameDay } from 'date-fns'
import HabitPreviewItem from '@/modules/habit/habit-preview-item.tsx'
import { getDateNameFirstLetter } from '@/lib/date.ts'
import { HabitStatus } from '@/modules/habit/types.ts'

const side = 'bottom'

interface IDailyActivitiesViewProps {
  date: Date
  styles: string
}

const DailyActivitiesView = (props: IDailyActivitiesViewProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const { isBlocking, habits, stats, completeHabit, createDefaultDailyStats } =
    useHabitsStore()

  const { date, styles } = props
  let dateStats = stats.find((s) => isSameDay(s.date, date))
  if (!dateStats) {
    dateStats = createDefaultDailyStats(date)
  }

  // filter habits
  const filteredHabits = habits.filter((habit) => {
    if (dateStats.completedIds.includes(habit.id)) {
      return habit
    }

    if (habit.status === HabitStatus.inactive) {
      return null
    }

    if (
      habit.daysOfWeek.includes(date.getDay()) &&
      isBefore(habit.createdAt, date)
    ) {
      return habit
    }

    if (isBefore(habit.lastActivatedAt, date)) {
      return habit
    }

    return null
  })

  const isInFuture = isAfter(date, new Date())

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
              className={`flex h-8 rounded-xl items-center justify-center ${styles}`}
            >
              {format(date, 'dd')}
            </div>
          </div>
        </SheetTrigger>
        {isOpen && !isInFuture && (
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
                    <p className='text-sm font-bold'>{filteredHabits.length}</p>
                  </div>
                  <div className='flex flex-row justify-between items-center'>
                    <p className='text-sm'>Completed activities</p>
                    <p className='text-sm font-bold'>
                      {dateStats.completedIds.length}
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
                    if (isBlocking) {
                      return
                    }

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
